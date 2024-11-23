import React, { useState, useEffect, useRef } from "react";
import "./WebRTCChat.css";

interface WebRTCChatProps {
  roomId: string;
}

const WebRTCChat: React.FC<WebRTCChatProps> = ({ roomId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const setupWebSocket = () => {
      const webSocket = new WebSocket(
        `wss://your-signaling-server.com?roomId=${roomId}`
      );

      webSocket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      webSocket.onmessage = async (message: MessageEvent) => {
        const data = JSON.parse(message.data);
        switch (data.type) {
          case "offer":
            await handleOffer(data.offer);
            break;
          case "answer":
            await handleAnswer(data.answer);
            break;
          case "ice-candidate":
            await handleNewICECandidate(data.candidate);
            break;
          default:
            console.log("Unknown message type:", data.type);
        }
      };

      webSocket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      webSocketRef.current = webSocket;
    };

    setupWebSocket();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [roomId]);

  const createPeerConnection = (): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && webSocketRef.current) {
        webSocketRef.current.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };

  const startCall = async () => {
    const peerConnection = createPeerConnection();
    peerConnectionRef.current = peerConnection;

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = localStream;
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
      }

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      if (webSocketRef.current) {
        webSocketRef.current.send(
          JSON.stringify({
            type: "offer",
            offer: peerConnection.localDescription,
          })
        );
      }

      setIsAudioOn(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const peerConnection = createPeerConnection();
    peerConnectionRef.current = peerConnection;

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));

    if (localAudioRef.current) {
      localAudioRef.current.srcObject = localStream;
    }

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    if (webSocketRef.current) {
      webSocketRef.current.send(
        JSON.stringify({
          type: "answer",
          answer: peerConnection.localDescription,
        })
      );
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleNewICECandidate = async (candidate: RTCIceCandidateInit) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding received ICE candidate:", error);
    }
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMuted(!isMuted);
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    setIsAudioOn(false);
  };

  return (
    <div className="webrtc-chat-container">
      <h2>WebRTC Voice Chat</h2>
      {!isAudioOn ? (
        <button onClick={startCall} disabled={!isConnected}>
          Start Call
        </button>
      ) : (
        <button onClick={endCall}>End Call</button>
      )}
      <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
      <div>
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
      </div>
    </div>
  );
};

export default WebRTCChat;
