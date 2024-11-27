// WebRTCChat.tsx
import React, { useEffect, useRef, useState } from "react";

interface Language {
  code: string;
  label: string;
  sttConfig: {
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives?: number;
  };
}

interface AudioContextRef {
  audioContext: AudioContext;
  analyser: AnalyserNode;
}

interface VoiceChatProps {
  roomId: string;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ roomId: initialRoomId }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>(initialRoomId || "");
  const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(!!initialRoomId);
  const [localVolume, setLocalVolume] = useState<number>(0);
  const [remoteVolume, setRemoteVolume] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ko-KR");
  const [callState, setCallState] = useState<
    "idle" | "calling" | "receiving" | "connected"
  >("idle");

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const localAudioContextRef = useRef<AudioContextRef | null>(null);
  const remoteAudioContextRef = useRef<AudioContextRef | null>(null);
  const recognitionRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const languages: Language[] = [
    {
      code: "ko-KR",
      label: "한국어",
      sttConfig: {
        continuous: true,
        interimResults: true,
      },
    },
    {
      code: "en-US",
      label: "English",
      sttConfig: {
        continuous: true,
        interimResults: true,
      },
    },
    {
      code: "zh-CN",
      label: "中文",
      sttConfig: {
        continuous: true,
        interimResults: true,
        maxAlternatives: 1,
      },
    },
    {
      code: "ja-JP",
      label: "日本語",
      sttConfig: {
        continuous: true,
        interimResults: true,
      },
    },
  ];

  const createPeerConnection = (): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ],
      iceTransportPolicy: "all",
      iceCandidatePoolSize: 10,
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
    });

    peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate && webSocketRef.current) {
        webSocketRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
          })
        );
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === "failed") {
        peerConnection.restartIce();
      }
    };

    peerConnection.ontrack = (event: RTCTrackEvent) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        setupRemoteAudioAnalyser(event.streams[0]);
      }
    };

    return peerConnection;
  };

  const joinRoom = (): void => {
    if (roomId.trim() === "") {
      alert("Please enter a valid room ID.");
      return;
    }

    const webSocket = new WebSocket(
      `wss://unbiased-evenly-worm.ngrok-free.app/voice-chat?roomId=${roomId}`
    );
    webSocketRef.current = webSocket;

    webSocket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    webSocket.onmessage = async (message: MessageEvent) => {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case "call-request":
          setCallState("receiving");
          break;

        case "call-accept":
          setCallState("connected");
          await startCall();
          break;

        case "offer":
          await handleOffer(data.offer);
          break;

        case "answer":
          await handleAnswer(data.answer);
          break;

        case "ice-candidate":
          await handleNewICECandidateMsg(data.candidate);
          break;

        case "call-end":
          handleCallEnd();
          break;
      }
    };

    webSocket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
      handleCallEnd();
    };

    webSocket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
      handleCallEnd();
    };

    setHasJoinedRoom(true);
  };

  const requestCall = async (): Promise<void> => {
    if (!webSocketRef.current) return;

    setCallState("calling");
    webSocketRef.current.send(
      JSON.stringify({
        type: "call-request",
        roomId: roomId,
      })
    );
  };

  const acceptCall = async (): Promise<void> => {
    if (!webSocketRef.current) return;

    setCallState("connected");
    webSocketRef.current.send(
      JSON.stringify({
        type: "call-accept",
        roomId: roomId,
      })
    );

    await startCall();
  };

  const handleOffer = async (
    offer: RTCSessionDescriptionInit
  ): Promise<void> => {
    const peerConnection = createPeerConnection();
    peerConnectionRef.current = peerConnection;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    localStreamRef.current = localStream;
    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));

    if (localAudioRef.current) {
      localAudioRef.current.srcObject = localStream;
    }

    setupLocalAudioAnalyser(localStream);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    if (webSocketRef.current) {
      webSocketRef.current.send(
        JSON.stringify({
          type: "answer",
          answer: answer,
        })
      );
    }
  };

  const handleAnswer = async (
    answer: RTCSessionDescriptionInit
  ): Promise<void> => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  };

  const handleNewICECandidateMsg = async (
    candidate: RTCIceCandidateInit
  ): Promise<void> => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding received ICE candidate", e);
      }
    }
  };

  const startCall = async (): Promise<void> => {
    const peerConnection = createPeerConnection();
    peerConnectionRef.current = peerConnection;

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = localStream;
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
      }

      setupLocalAudioAnalyser(localStream);
      startSpeechRecognition();

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      if (webSocketRef.current) {
        webSocketRef.current.send(
          JSON.stringify({
            type: "offer",
            offer: offer,
          })
        );
      }

      setIsAudioOn(true);
    } catch (error) {
      console.error("Error starting call:", error);
      handleCallEnd();
    }
  };

  const handleCallEnd = (): void => {
    cleanupCall();
    setCallState("idle");
  };

  const cleanupCall = (): void => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localAudioRef.current) {
      localAudioRef.current.srcObject = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    if (localAudioContextRef.current?.audioContext) {
      localAudioContextRef.current.audioContext.close();
    }
    if (remoteAudioContextRef.current?.audioContext) {
      remoteAudioContextRef.current.audioContext.close();
    }

    stopSpeechRecognition();
    setIsAudioOn(false);
  };

  const endCall = (): void => {
    if (webSocketRef.current) {
      webSocketRef.current.send(
        JSON.stringify({
          type: "call-end",
          roomId: roomId,
        })
      );
    }
    handleCallEnd();
  };

  const toggleMute = (): void => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const setupLocalAudioAnalyser = (stream: MediaStream): void => {
    if (localAudioContextRef.current?.audioContext) {
      localAudioContextRef.current.audioContext.close();
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.8;

    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(analyser);

    localAudioContextRef.current = { audioContext, analyser };

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setLocalVolume(volume);
      if (isAudioOn) {
        requestAnimationFrame(updateVolume);
      }
    };

    updateVolume();
  };

  const setupRemoteAudioAnalyser = (stream: MediaStream): void => {
    if (remoteAudioContextRef.current?.audioContext) {
      remoteAudioContextRef.current.audioContext.close();
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    remoteAudioContextRef.current = { audioContext, analyser };

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setRemoteVolume(volume);
      if (isAudioOn) {
        requestAnimationFrame(updateVolume);
      }
    };

    updateVolume();
  };

  const startSpeechRecognition = (): void => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("This browser doesn't support Speech Recognition.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    const selectedLang = languages.find(
      (lang) => lang.code === selectedLanguage
    );

    if (!selectedLang) return;

    recognition.lang = selectedLang.code;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log(`STT started for ${selectedLang.label}`);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript((prev) => prev + result + "\n");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "no-speech" || event.error === "network") {
        setTimeout(() => {
          if (isAudioOn && recognitionRef.current) {
            recognition.start();
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      if (isAudioOn) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            // WebRTCChat.tsx (continuation)
            console.error("Failed to restart STT:", e);
            setTimeout(() => {
              if (isAudioOn) {
                startSpeechRecognition();
              }
            }, 1000);
          }
        }, 1000);
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Failed to start STT:", e);
    }
  };

  const stopSpeechRecognition = (): void => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setTranscript("");
  };

  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);

    if (isAudioOn) {
      stopSpeechRecognition();
      setTimeout(() => {
        startSpeechRecognition();
      }, 100);
    }
  };

  useEffect(() => {
    if (initialRoomId) {
      joinRoom();
    }

    return () => {
      cleanupCall();
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [initialRoomId]);

  return (
    <div className="voice-chat-container">
      <h1 className="voice-chat-title">1:1 Voice Chat</h1>
      {!hasJoinedRoom ? (
        <div className="join-room-container">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="room-input"
          />
          <button onClick={joinRoom} className="chat-button">
            Join Room
          </button>
        </div>
      ) : (
        <div className="chat-controls">
          <p className="connection-status">
            Connection status: {isConnected ? "Connected" : "Disconnected"}
          </p>

          {callState === "idle" && (
            <button
              onClick={requestCall}
              disabled={!isConnected}
              className="chat-button"
            >
              Start Call
            </button>
          )}

          {callState === "receiving" && (
            <div className="call-request">
              <p>Incoming call...</p>
              <button onClick={acceptCall} className="chat-button accept">
                Accept
              </button>
              <button
                onClick={() => {
                  setCallState("idle");
                  cleanupCall();
                }}
                className="chat-button reject"
              >
                Decline
              </button>
            </div>
          )}

          {callState === "calling" && (
            <div className="call-status">
              <p>Waiting for answer...</p>
              <button
                onClick={() => {
                  setCallState("idle");
                  cleanupCall();
                }}
                className="chat-button"
              >
                Cancel
              </button>
            </div>
          )}

          {callState === "connected" && (
            <div className="active-call-controls">
              <button onClick={endCall} className="chat-button end-call">
                End Call
              </button>
              <button onClick={toggleMute} className="chat-button">
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </div>
          )}

          {isAudioOn && (
            <>
              <div className="volume-display">
                <div className="volume-meter">
                  <h3>Your Voice Volume:</h3>
                  <div
                    className="volume-bar"
                    style={{
                      width: `${Math.min(100, localVolume)}%`,
                      backgroundColor: `hsl(${120 - localVolume}, 80%, 50%)`,
                    }}
                  />
                  <span>{Math.round(localVolume)}%</span>
                </div>
                <div className="volume-meter">
                  <h3>Remote Voice Volume:</h3>
                  <div
                    className="volume-bar"
                    style={{
                      width: `${Math.min(100, remoteVolume)}%`,
                      backgroundColor: `hsl(${120 - remoteVolume}, 80%, 50%)`,
                    }}
                  />
                  <span>{Math.round(remoteVolume)}%</span>
                </div>
              </div>

              <div className="language-select">
                <h3>음성 인식 언어:</h3>
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="language-dropdown"
                >
                  {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="transcript-display">
                <h3>음성 인식 결과:</h3>
                <div
                  className="transcript-text"
                  style={{
                    whiteSpace: "pre-wrap",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {transcript}
                </div>
                <button
                  onClick={() => setTranscript("")}
                  className="chat-button clear-transcript"
                >
                  Clear Text
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="audio-elements" style={{ display: "none" }}>
        <audio ref={localAudioRef} autoPlay muted></audio>
        <audio ref={remoteAudioRef} autoPlay></audio>
      </div>
    </div>
  );
};

export default VoiceChat;
