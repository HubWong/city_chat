// hooks/useVideoCall.js
import { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import { sleep, checkMediaDevices } from "@/services/toolFuncs";
import { TransModel } from "@/shared/model/appModels";
import { ChatSystem } from "@/shared/model/chatSystem";
import SocketClient from "@/shared/model/socketModel";
import ChatBridge from "@/shared/model/chatBridge";

export async function verifyDeviceBeforeCall() {
    const { camera, mic } = await checkMediaDevices();
    if (!camera && !mic) {
        return { ok: false, reason: "未检测到摄像头和麦克风" };
    }
    return { ok: true };
}


export function useVideoCall() {
    const socket = SocketClient.get()

    const [streams, setStreams] = useState([]);
    const [videoError, setVideoError] = useState(null)
    const peerRef = useRef(null);

    const localStreamRef = useRef(null);

    const openLocalVideo = async (initiator = true) => {
        const trsModel = new TransModel()
        const targetUser = ChatSystem.getActiveChatUser()
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })

            localStreamRef.current = stream

            const peer = new Peer({ initiator, trickle: false, stream })

            peer.on("signal", (signal) => {
                socket.emit("video_signal", { signal, to: targetUser.sid })
            })

            peer.on("track", (_, remoteStream) => {
                if (!remoteStream) return
                setStreams(prev =>
                    prev.find(s => s.id === remoteStream.id)
                        ? prev
                        : [...prev, remoteStream]
                )
            })

            peer.on("stream", (remoteStream) => {
                setStreams([stream, remoteStream])
            })

            peerRef.current = peer
            trsModel.success = true

            return trsModel   // ✅ 真正返回给调用方

        } catch (err) {
            trsModel.success = false
            trsModel.msg = err.name === 'NotAllowedError'
                ? '摄像头或麦克风权限被拒绝'
                : String(err)

            setVideoError(err)
            stopVideoCall()

            return trsModel   // ✅ 真正返回
        }
    }

    const startVideoCall = async () => {

        const trsModel = new TransModel()

        const targetUser = ChatSystem.getActiveChatUser()
        if (!targetUser) {
            trsModel.success = false
            trsModel.msg = 'no active user'
            return trsModel
        }

        const result = await verifyDeviceBeforeCall()
        if (!result.ok) {
            trsModel.success = false
            trsModel.msg = '没有视频设备'
            return trsModel
        }
        trsModel.success = true
        return trsModel

    }


    const handleIncomingSignal = async (signal) => {
        const isIdel = ChatSystem.call.status === ChatSystem.CallStatus.IDLE
        await sleep(3000)
        if (isIdel) {
            console.log('user not accepted yet..')
            return
        }
        console.log('user ccpetd.')
        if (peerRef.current == null) {
            console.warn('--signal comes,and peer current is null')
            openLocalVideo(true)
        }
        peerRef.current?.signal(signal);
    };


    const accepteVideoCall = async () => {    //target accpet my call     
        await openLocalVideo(true)
    }

    const stopVideoCall = () => {
        // 停止本地 track
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;

        // 销毁 peer
        peerRef.current?.destroy();
        peerRef.current = null;
        if (streams.length > 0) {
            setStreams([]);
        }

        const targetUser = ChatSystem.getActiveChatUser()
        if (targetUser) {
            ChatBridge.end_call(targetUser.sid)
        }
    };

    return { streams, startVideoCall, handleIncomingSignal, localStreamRef, accepteVideoCall, openLocalVideo, stopVideoCall };
}
