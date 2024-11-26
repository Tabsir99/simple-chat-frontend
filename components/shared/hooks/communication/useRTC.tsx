import { CallSession } from "@/types/ChatTypes/CallTypes";
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


  const getUserMedia = useCallback(async (isVideo: boolean) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,

          sampleRate: { ideal: 48000 },
          sampleSize: { ideal: 16 },
          channelCount: 1,
        },
        ...(isVideo && {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
            facingMode: "user",
          },
        }),
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
    async ({
      isVideoCall,
      chatRoomId,
      caller,
      callId,
      recipients,
    }: CallSession) => {
      // if(!socket) return
      try {
        const stream = await getUserMedia(isVideoCall);
        const pc = await createConnection(chatRoomId, stream);

        const offer = await pc.createOffer();

        await pc.setLocalDescription(offer);
        socket?.emit("call-offer", {
          offer,
          to: chatRoomId,
          isVideoCall,
          caller,
          callId,
          recipientId: recipients[0].userId,
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

        return answer;
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
      console.log("call ending, local stream stopping");
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    pendingCandidates.current = [];
    setRemoteStream(null);
  }, [localStream]);

  const switchCamera = useCallback(async () => {
    if (!localStream) return;

    const currentVideoTrack = localStream.getVideoTracks()[0];
    if (!currentVideoTrack) return;

    const currentFacingMode = currentVideoTrack.getSettings().facingMode;
    const newFacingMode = currentFacingMode === "user" ? "environment" : "user";

    console.log(currentFacingMode);
    currentVideoTrack.stop();

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      const sender = pConnection.current
        ?.getSenders()
        .find((sender) => sender.track?.kind === "video");
      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      const updatedStream = new MediaStream([newVideoTrack]);
      setLocalStream(updatedStream);
    } catch (error) {
      console.log("Error switching camera:", error);
    }
  }, [localStream]);

  return {
    getUserMedia,
    createConnection,
    makeOutgoingCalls,
    handleIncomingCall,
    handleIceCandidate,
    endCall,
    handleAnswer,
    switchCamera,
    localStream,
    remoteStream,
    pConnection
  };
};
