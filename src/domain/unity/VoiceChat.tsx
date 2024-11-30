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
  const [showIncomingCall, setShowIncomingCall] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<string>("new");

  // Refs
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const localAudioContextRef = useRef<AudioContextRef | null>(null);
  const remoteAudioContextRef = useRef<AudioContextRef | null>(null);
  const recognitionRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingICECandidatesRef = useRef<RTCIceCandidate[]>([]);

  const languages: Language[] = [
    {
      code: "ko-KR",
      label: "한국어",
      sttConfig: { continuous: true, interimResults: true },
    },
    {
      code: "en-US",
      label: "English",
      sttConfig: { continuous: true, interimResults: true },
    },
    {
      code: "zh-CN",
      label: "中文",
      sttConfig: { continuous: true, interimResults: true, maxAlternatives: 1 },
    },
    {
      code: "ja-JP",
      label: "日本語",
      sttConfig: { continuous: true, interimResults: true },
    },
  ];

  // WebRTC 연결 설정
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

    // 연결 상태 모니터링 추가
    peerConnection.onconnectionstatechange = () => {
      setConnectionState(peerConnection.connectionState);
      console.log("Connection State Changed:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === "failed") {
        console.log("ICE 연결 실패 - 재시도");
        peerConnection.restartIce();
      }
    };

    // ICE 후보 이벤트 처리
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && webSocketRef.current) {
        webSocketRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
          })
        );
      }
    };

    // ICE 연결 상태 변경 처리
    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === "failed") {
        peerConnection.restartIce();
      }
    };

    // 원격 스트림 처리
    peerConnection.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        setupRemoteAudioAnalyser(event.streams[0]);
      }
    };

    return peerConnection;
  };

  // 방 관리
  const joinRoom = (): void => {
    if (roomId.trim() === "") {
      alert("유효한 방 ID를 입력해주세요.");
      return;
    }

    const webSocket = new WebSocket(
      `wss://unbiased-evenly-worm.ngrok-free.app/voice-chat?roomId=${roomId}`
    );
    webSocketRef.current = webSocket;

    webSocket.onopen = () => {
      setIsConnected(true);
    };

    webSocket.onmessage = async (message: MessageEvent) => {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case "call-request":
          setShowIncomingCall(true);
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
      handleCallEnd();
    };

    webSocket.onerror = () => {
      handleCallEnd();
    };

    setHasJoinedRoom(true);
  };

  // 통화 관리
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
    setShowIncomingCall(false);
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
    try {
      await cleanupExistingConnection();

      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 상태 체크 추가
      if (
        !peerConnection.signalingState ||
        peerConnection.signalingState === "closed"
      ) {
        throw new Error("Invalid connection state");
      }

      // Remote Description 설정 전에 로컬 스트림 추가
      localStreamRef.current = localStream;
      localStream.getTracks().forEach((track) => {
        if (peerConnection.signalingState !== "closed") {
          peerConnection.addTrack(track, localStream);
        }
      });

      // Remote Description 설정
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      // Answer 생성 및 설정
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Answer 전송
      webSocketRef.current?.send(
        JSON.stringify({
          type: "answer",
          answer,
        })
      );
    } catch (error) {
      console.error("Offer handling error:", error);
      await cleanupExistingConnection();
    }
  };

  const cleanupExistingConnection = async (): Promise<void> => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localAudioContextRef.current?.audioContext?.state !== "closed") {
      await localAudioContextRef.current?.audioContext?.close();
    }
  };
  const handleAnswer = async (
    answer: RTCSessionDescriptionInit
  ): Promise<void> => {
    if (!peerConnectionRef.current) return;

    try {
      // 현재 signalingState 확인
      if (peerConnectionRef.current.signalingState === "stable") {
        console.log("Connection already in stable state, ignoring answer");
        return;
      }

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

      // 저장된 ICE candidate 처리
      while (pendingICECandidatesRef.current.length > 0) {
        const candidate = pendingICECandidatesRef.current.shift();
        if (candidate) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
      }
    } catch (error) {
      console.error("Error setting remote description:", error);
      handleCallEnd();
    }
  };
  // startCall 함수 수정
  const startCall = async (): Promise<void> => {
    try {
      await cleanupExistingConnection();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1,
        },
      });

      localStreamRef.current = stream;

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;

      // 스트림 추가
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Offer 생성 전 상태 확인
      if (peerConnection.signalingState !== "stable") {
        console.warn("Connection not in stable state, waiting...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
      });

      await peerConnection.setLocalDescription(offer);

      webSocketRef.current?.send(
        JSON.stringify({
          type: "offer",
          offer: offer,
        })
      );

      setIsAudioOn(true);
    } catch (error) {
      console.error("통화 시작 중 오류:", error);
      handleCallEnd();
    }
  };

  const handleNewICECandidateMsg = async (
    candidate: RTCIceCandidateInit
  ): Promise<void> => {
    if (
      !peerConnectionRef.current ||
      !peerConnectionRef.current.remoteDescription
    ) {
      // Remote description이 없으면 candidate를 저장
      pendingICECandidatesRef.current.push(new RTCIceCandidate(candidate));
      return;
    }

    try {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
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
    setShowIncomingCall(false);
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

  // 오디오 분석 설정
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

  // 음성 인식 기능
  const startSpeechRecognition = (): void => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
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
      console.log(`${selectedLang.label} 음성 인식이 시작되었습니다`);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript((prev) => prev + result + "\n");
    };

    recognition.onerror = (event: any) => {
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
            console.error("음성 인식 재시작 실패:", e);
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
      console.error("음성 인식 시작 실패:", e);
    }
  };

  const stopSpeechRecognition = (): void => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setTranscript("");
  };

  const handleLanguageChange = (newLanguage: string): void => {
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
    <div className="w-80 bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-white/20">
      {/* 헤더 */}
      <div className="p-3 bg-blue-500 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">음성 채팅</h2>
        {isConnected && (
          <span className="px-2 py-0.5 text-xs bg-green-400 rounded-full text-white">
            연결됨
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {!hasJoinedRoom ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="방 ID 입력"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={joinRoom}
              className="w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              방 입장
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 통화 제어 */}
            <div>
              {callState === "idle" && (
                <button
                  onClick={requestCall}
                  disabled={!isConnected}
                  className="w-full py-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  통화 시작
                </button>
              )}

              {callState === "calling" && (
                <div className="space-y-2">
                  <p className="text-sm text-center text-white">
                    응답 대기중...
                  </p>
                  <button
                    onClick={() => {
                      setCallState("idle");
                      cleanupCall();
                    }}
                    className="w-full py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                  >
                    취소
                  </button>
                </div>
              )}

              {callState === "connected" && (
                <div className="flex gap-2">
                  <button
                    onClick={toggleMute}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    {isMuted ? "음성 켜기" : "음성 끄기"}
                  </button>
                  <button
                    onClick={endCall}
                    className="flex-1 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    통화 종료
                  </button>
                </div>
              )}
            </div>

            {isAudioOn && (
              <>
                {/* 볼륨 미터 */}
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-white">
                      내 음성
                    </label>
                    <div className="mt-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, localVolume)}%`,
                          backgroundColor: `hsl(${
                            120 - localVolume
                          }, 80%, 50%)`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white">
                      상대방 음성
                    </label>
                    <div className="mt-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, remoteVolume)}%`,
                          backgroundColor: `hsl(${
                            120 - remoteVolume
                          }, 80%, 50%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 언어 선택 */}
                <div>
                  <label className="text-xs font-medium block mb-1 text-white">
                    음성 인식 언어
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map((lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                        className="bg-gray-800"
                      >
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 스크립트 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-white">
                      스크립트
                    </label>
                    {transcript && (
                      <button
                        onClick={() => setTranscript("")}
                        className="text-xs text-white/70 hover:text-white"
                      >
                        지우기
                      </button>
                    )}
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 h-32 overflow-y-auto text-sm text-white">
                    {transcript || "음성 입력 대기중..."}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 수신 통화 알림 */}
      {showIncomingCall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 p-6 rounded-lg shadow-xl max-w-sm mx-4 border border-white/20">
            <h3 className="text-lg font-semibold mb-2 text-white">수신 통화</h3>
            <p className="text-white/80 mb-4">
              누군가가 이 방에서 연결을 시도하고 있습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowIncomingCall(false);
                  setCallState("idle");
                  cleanupCall();
                }}
                className="flex-1 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                거절
              </button>
              <button
                onClick={acceptCall}
                className="flex-1 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                수락
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 숨겨진 오디오 요소 */}
      <div className="hidden">
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
      </div>
    </div>
  );
};

export default VoiceChat;
