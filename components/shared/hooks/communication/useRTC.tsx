import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

const config: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun.services.mozilla.com" },
  ],
};

export const useRTC = (socket: Socket | null) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pConnection = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);



  useEffect(() => {
    console.log("remotestream:",remoteStream)
  },[remoteStream])
  const getUserMedia = useCallback(async (isVideo: boolean) => {
    console.log("is it video,",isVideo)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo,
      });
      setLocalStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.error("Error, permission failed");
      throw error;
    }
  }, []);

  const createConnection = useCallback(
    async (chatRoomId: string, mediaStream: MediaStream) => {
      const pc = new RTCPeerConnection(config);
      pConnection.current = pc;

      mediaStream.getTracks().forEach((track) => {
        pc.addTrack(track, mediaStream);
      });
      pc.ontrack = (ev) => {
        setRemoteStream(ev.streams[0]);
      };
      pc.onicecandidate = (ev) => {
        if (ev.candidate) {
          socket?.emit("ice-candidate", {
            candidate: ev.candidate,
            chatRoomId: chatRoomId,
          });
        }
      };

      return pc;
    },

    [socket]
  );

  const makeOutgoingCalls = useCallback(
    async (
      chatRoomId: string,
      isVideo: boolean,
      currentUser: any,
      callId: string
    ) => {
      // if(!socket) return
      try {
        const stream = await getUserMedia(isVideo);
        const pc = await createConnection(chatRoomId, stream);

        const offer = await pc.createOffer();

        await pc.setLocalDescription(offer);
        socket?.emit("call-offer", {
          offer,
          to: chatRoomId,
          isVideo,
          caller: currentUser,
          callId,
        });
      } catch (error) {
        console.log("Outgoing call failed");
        console.log(error);
      }
    },
    [getUserMedia, createConnection, socket]
  );

  const handleIncomingCall = useCallback(
    async ({
      chatRoomId,
      offer,
      isVideo,
    }: {
      chatRoomId: string;
      offer: RTCSessionDescriptionInit;
      isVideo: boolean;
    }) => {
      try {
        const stream = await getUserMedia(isVideo);
        const pc = await createConnection(chatRoomId, stream);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        while (pendingCandidates.current.length > 0) {
          const candidate = pendingCandidates.current.shift();
          if (candidate) {
            await pc.addIceCandidate(candidate);
          }
        }

        socket?.emit("call-answer", {
          answer,
          to: chatRoomId,
        });
      } catch (err) {
        console.error("Error handling incoming call:", err);
        throw err;
      }
    },
    [socket, getUserMedia, createConnection]
  );

  const handleAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      try {
        if (pConnection.current) {
          await pConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );          
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    },
    []
  );

  const handleIceCandidate = useCallback((candidate: RTCIceCandidate) => {
    try {
        pendingCandidates.current.push(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error handling ICE candidate:", err);
    }
  }, []);

  const endCall = useCallback(() => {
    if (pConnection.current) {
      pConnection.current.close();
      pConnection.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());

      setLocalStream(null);
    }

    pendingCandidates.current = [];
    setRemoteStream(null);
  }, [localStream]);

  return {
    getUserMedia,
    createConnection,
    makeOutgoingCalls,
    handleIncomingCall,
    handleIceCandidate,
    endCall,
    handleAnswer,
    localStream,
    remoteStream,
  };
};
