// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// // WebSocket 또는 시그널링 서버에 연결
// const socket = io('http://localhost:3000');

// const WebRTCVoiceWithSubtitles = ({ userId }) => {
//   const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
//   const [remoteUserId, setRemoteUserId] = useState<string>('');
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [subtitles, setSubtitles] = useState<string>(''); // 자막용 상태
//   const [remoteSubtitles, setRemoteSubtitles] = useState<string>(''); // 상대방 자막용 상태

//   useEffect(() => {
//     // 사용자 등록
//     socket.emit('register', userId);

//     // offer 수신 처리
//     socket.on('receiveOffer', async ({ offer, fromUserId }) => {
//       const pc = createPeerConnection(fromUserId);
//       await pc.setRemoteDescription(new RTCSessionDescription(offer));

//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       socket.emit('sendAnswer', { answer, toUserId: fromUserId });
//     });

//     // answer 수신 처리
//     socket.on('receiveAnswer', async ({ answer }) => {
//       if (peerConnection) {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//       }
//     });

//     // ICE 후보 수신 처리
//     socket.on('receiveCandidate', async ({ candidate }) => {
//       if (peerConnection) {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//       }
//     });

//     // 상대방 자막 수신 처리
//     socket.on('receiveSubtitles', (subtitles) => {
//       setRemoteSubtitles(subtitles);
//     });

//     return () => {
//       socket.off('receiveOffer');
//       socket.off('receiveAnswer');
//       socket.off('receiveCandidate');
//       socket.off('receiveSubtitles');
//     };
//   }, [peerConnection, userId]);

//   // 상대방과의 연결 시작
//   const startConnection = async (targetUserId: string) => {
//     const pc = createPeerConnection(targetUserId);
//     setRemoteUserId(targetUserId);

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     socket.emit('sendOffer', { offer, toUserId: targetUserId });
//   };

//   // PeerConnection 생성 및 오디오 트랙 추가
//   const createPeerConnection = (targetUserId: string) => {
//     const pc = new RTCPeerConnection();

//     // 로컬 오디오 스트림 가져오기
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         setLocalStream(stream);
//         stream.getTracks().forEach(track => pc.addTrack(track, stream));
//       })
//       .catch(error => console.error('Error accessing audio stream:', error));

//     // 원격 스트림 설정
//     pc.ontrack = (event) => {
//       const [remoteStream] = event.streams;
//       setRemoteStream(remoteStream);
//     };

//     // ICE 후보 처리
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('sendCandidate', { candidate: event.candidate, toUserId: targetUserId });
//       }
//     };

//     // 데이터 채널 생성 (자막 전송)
//     const dataChannel = pc.createDataChannel('subtitles');
//     dataChannel.onmessage = (event) => {
//       setRemoteSubtitles(event.data);
//     };

//     setPeerConnection(pc);
//     return pc;
//   };

//   // 자막 생성 및 전송
//   const handleSpeechRecognition = () => {
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setSubtitles(transcript);
//       socket.emit('sendSubtitles', { subtitles: transcript, toUserId: remoteUserId });
//     };

//     recognition.start();
//   };

//   return (
//     <div>
//       <h3>WebRTC 음성 채팅 + 자막</h3>
//       <input
//         type="text"
//         placeholder="상대방 ID 입력"
//         onChange={(e) => setRemoteUserId(e.target.value)}
//       />
//       <button onClick={() => startConnection(remoteUserId)}>연결 시작</button>
//       <button onClick={handleSpeechRecognition}>말하기</button>

//       <div>
//         <h4>내 오디오</h4>
//         <audio autoPlay controls ref={(audio) => audio && localStream && (audio.srcObject = localStream)} />
//       </div>

//       <div>
//         <h4>상대방 오디오</h4>
//         <audio autoPlay controls ref={(audio) => audio && remoteStream && (audio.srcObject = remoteStream)} />
//       </div>

//       <div>
//         <h4>내 자막</h4>
//         <p>{subtitles}</p>
//       </div>

//       <div>
//         <h4>상대방 자막</h4>
//         <p>{remoteSubtitles}</p>
//       </div>
//     </div>
//   );
// };

// export default WebRTCVoiceWithSubtitles;
