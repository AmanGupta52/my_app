// src/components/VideoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * VideoCall.jsx
 * - Robust remote track handling (user-published, unpublished, left)
 * - Permission-first flow (forces browser prompt before join)
 * - Clear errors for missing/invalid APP_ID or token issues
 * - Mic / Camera toggle, leave, participant list UI
 *
 * Usage: /video-call?channelName=CHANNEL_NAME&token=AGORA_TOKEN[&appId=APP_ID&uid=123]
 *
 * IMPORTANT:
 *  - Put REACT_APP_AGORA_APP_ID in .env (restart dev server)
 *  - If your Agora project has App Certificate enabled you must provide a token
 */

export default function VideoCall() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const channel = params.get("channelName");
    const token = params.get("token");
    const appIdParam = params.get("appId");
    const uidParam = params.get("uid");
    const APP_ID = appIdParam || process.env.REACT_APP_AGORA_APP_ID;

    const clientRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    const localVideoTrackRef = useRef(null);
    const localVideoContainerRef = useRef(null);
    const joinedUidRef = useRef(null);

    const [permissionAsked, setPermissionAsked] = useState(false);
    const [permissionError, setPermissionError] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("idle"); // idle | requesting-permissions | joining | joined | failed
    const [loading, setLoading] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [participants, setParticipants] = useState([]); // { uid, hasVideo, hasAudio, isLocal }

    // helpers
    const shortId = (id) => String(id).slice(0, 6);

    const addOrUpdateParticipant = (uid, updates = {}) => {
        setParticipants((prev) => {
            const idx = prev.findIndex((p) => p.uid === uid);
            if (idx === -1) return [...prev, { uid, ...updates }];
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...updates };
            return copy;
        });
    };

    const removeParticipant = (uid) => {
        setParticipants((prev) => prev.filter((p) => p.uid !== uid));
    };

    // Request permission BEFORE joining Agora (prevents NotAllowedError)
    const requestPermissions = async () => {
        setPermissionError("");
        setError("");
        setStatus("requesting-permissions");
        try {
            // This forces the browser prompt. If denied, this will throw.
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setPermissionAsked(true);
            setStatus("idle");
        } catch (err) {
            console.error("Permission error:", err);
            setPermissionError("Camera/Microphone permission denied. Please allow access in browser/OS settings.");
            setStatus("failed");
        }
    };

    // Clean up local tracks and client
    const cleanupAgora = async () => {
        try {
            if (clientRef.current) {
                await clientRef.current.leave();
            }
        } catch (e) {
            // ignore
        }
        try {
            localAudioTrackRef.current?.stop();
            localAudioTrackRef.current?.close();
        } catch (e) { }
        try {
            localVideoTrackRef.current?.stop();
            localVideoTrackRef.current?.close();
        } catch (e) { }
        clientRef.current = null;
        localAudioTrackRef.current = null;
        localVideoTrackRef.current = null;
        joinedUidRef.current = null;
        setParticipants([]);
        setStatus("idle");
    };

    // Join call: attempts join and sets up handlers for remote users
    useEffect(() => {
        // only attempt to join when we have channel and user accepted permission
        if (!channel || !permissionAsked) return;

        let mounted = true;
        const joinCall = async () => {
            setError("");
            setLoading(true);
            setStatus("joining");

            if (!APP_ID) {
                setError("Missing Agora APP_ID. Add REACT_APP_AGORA_APP_ID in your .env or pass ?appId=...");
                setStatus("failed");
                setLoading(false);
                return;
            }

            // Create client
            const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            clientRef.current = client;

            // Helper: play remote track in element
            const playRemoteVideo = (user) => {
                const el = document.getElementById(`remote-${user.uid}`);
                if (el && user.videoTrack) {
                    try {
                        user.videoTrack.play(el);
                    } catch (e) {
                        console.warn("play remote error", e);
                    }
                }
            };

            // Event: user published
            client.on("user-published", async (user, mediaType) => {
                try {
                    await client.subscribe(user, mediaType);
                    // add or update participant
                    const hasVideo = !!user.videoTrack;
                    const hasAudio = !!user.audioTrack;
                    addOrUpdateParticipant(user.uid, { uid: user.uid, hasVideo, hasAudio, isLocal: false });

                    // play immediately if track exists
                    if (mediaType === "video") {
                        // short timeout to ensure container exists
                        setTimeout(() => playRemoteVideo(user), 50);
                    }
                    if (mediaType === "audio" && user.audioTrack) {
                        try {
                            user.audioTrack.play();
                        } catch (e) {
                            console.warn("audio play failed", e);
                        }
                    }
                } catch (err) {
                    console.error("subscribe error", err);
                    setError(`Error subscribing to remote user: ${err?.message || err}`);
                }
            });

            // Event: user unpublished
            client.on("user-unpublished", (user, mediaType) => {
                if (mediaType === "video") {
                    addOrUpdateParticipant(user.uid, { hasVideo: false });
                    const el = document.getElementById(`remote-${user.uid}`);
                    if (el) el.innerHTML = "";
                }
                if (mediaType === "audio") {
                    addOrUpdateParticipant(user.uid, { hasAudio: false });
                }
            });

            // Event: user left
            client.on("user-left", (user) => {
                removeParticipant(user.uid);
                const el = document.getElementById(`remote-${user.uid}`);
                if (el) el.innerHTML = "";
            });

            // connection-state-change: helpful for UI
            client.on("connection-state-change", (cur, rev) => {
                console.log("Agora connection state:", cur, rev);
                if (!mounted) return;
                if (cur === "DISCONNECTED" || cur === "FAILED") {
                    setStatus("failed");
                    setError("Connection lost. Try reloading or checking network.");
                }
            });

            // Attempt join
            try {
                const requestedUid = uidParam ? Number(uidParam) : undefined;
                const localUid = await client.join(APP_ID, channel, token || null, requestedUid);
                joinedUidRef.current = localUid;

                // create local tracks AFTER join - more reliable for some devices
                const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                localAudioTrackRef.current = microphoneTrack;
                localVideoTrackRef.current = cameraTrack;

                // play local video
                try {
                    cameraTrack.play(localVideoContainerRef.current);
                } catch (e) {
                    console.warn("local play failed", e);
                }

                // publish
                await client.publish([microphoneTrack, cameraTrack]);

                // add local participant to list
                addOrUpdateParticipant(localUid, { uid: localUid, hasVideo: true, hasAudio: true, isLocal: true });

                setIsCameraOn(true);
                setIsMicOn(true);
                setStatus("joined");
            } catch (joinErr) {
                console.error("join error", joinErr);
                // Provide actionable errors
                const message = String(joinErr?.message || joinErr);
                if (message.includes("CAN_NOT_GET_GATEWAY_SERVER") || message.includes("invalid vendor key")) {
                    setError("Invalid APP_ID or project configuration. Create a Standard project in Agora Console and use the new App ID.");
                } else if (message.toLowerCase().includes("dynamic use static key") || message.toLowerCase().includes("token")) {
                    setError("This Agora project requires a token. Provide a valid token via ?token=... or generate a RTC token on your backend.");
                } else if (message.toLowerCase().includes("permission")) {
                    setError("Camera/Mic permission denied by browser or OS. Check OS privacy and browser site permissions.");
                } else {
                    setError(`Failed to join channel: ${message}`);
                }
                setStatus("failed");
                // cleanup tracks
                try {
                    localAudioTrackRef.current?.stop();
                    localAudioTrackRef.current?.close();
                    localVideoTrackRef.current?.stop();
                    localVideoTrackRef.current?.close();
                } catch { }
            } finally {
                setLoading(false);
            }
        };

        joinCall();

        return () => {
            mounted = false;
            // cleanup
            cleanupAgora();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel, permissionAsked]); // note: APP_ID and token are read fresh from closure

    // Toggle mic
    const toggleMic = async () => {
        if (!localAudioTrackRef.current) return;
        try {
            const newState = !isMicOn;
            await localAudioTrackRef.current.setEnabled(newState);
            setIsMicOn(newState);
            // update local participant
            const local = participants.find((p) => p.isLocal);
            if (local) addOrUpdateParticipant(local.uid, { hasAudio: newState });
        } catch (e) {
            console.error("toggleMic error", e);
            setError("Unable to toggle microphone: " + (e?.message || e));
        }
    };

    // Toggle camera
    const toggleCamera = async () => {
        if (!localVideoTrackRef.current) return;
        try {
            const newState = !isCameraOn;
            await localVideoTrackRef.current.setEnabled(newState);
            setIsCameraOn(newState);
            const local = participants.find((p) => p.isLocal);
            if (local) addOrUpdateParticipant(local.uid, { hasVideo: newState });
            // when enabling camera after disabled, replay to container
            if (newState && localVideoContainerRef.current) {
                try {
                    localVideoTrackRef.current.play(localVideoContainerRef.current);
                } catch (e) { }
            }
        } catch (e) {
            console.error("toggleCamera error", e);
            setError("Unable to toggle camera: " + (e?.message || e));
        }
    };

    // Leave call
    const leave = async () => {
        setLoading(true);
        try {
            await cleanupAgora();
            navigate("/");
        } catch (e) {
            console.error("leave error", e);
            setError("Error leaving call: " + (e?.message || e));
        } finally {
            setLoading(false);
        }
    };

    // Mini UI render
    return (
        <div className="min-h-screen bg-gray-100 text-sm">
            {/* Header */}
            <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold">Video Call</h1>
                    <span className="text-sm text-gray-500">Channel: {channel || "—"}</span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 mr-2">Status: <strong className="ml-1">{status}</strong></span>
                    <button onClick={() => navigate(-1)} className="px-3 py-1 rounded-md text-sm border hover:bg-gray-50">← Back</button>
                    <button onClick={leave} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">Leave</button>
                </div>
            </header>

            {/* Error banners */}
            {permissionError && (
                <div className="bg-yellow-500 text-black p-3 text-center">
                    {permissionError}
                </div>
            )}
            {error && (
                <div className="bg-red-600 text-white p-3 text-center">
                    {error}
                </div>
            )}

            <main className="p-4 grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
                {/* Video area */}
                <section className="bg-white rounded shadow p-4 flex flex-col">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Local video */}
                        <div className="relative bg-black rounded overflow-hidden flex items-center justify-center min-h-[240px]">
                            <div ref={localVideoContainerRef} className="w-full h-full" />
                            <div className="absolute left-3 bottom-3 bg-black/50 text-white text-xs px-2 py-1 rounded">You</div>
                        </div>

                        {/* Remote videos grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {participants.filter(p => !p.isLocal).map(p => (
                                <div key={p.uid} className="relative bg-gray-900 rounded overflow-hidden flex items-center justify-center min-h-[140px]">
                                    <div id={`remote-${p.uid}`} className="w-full h-full" />
                                    <div className="absolute left-2 top-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{shortId(p.uid)}</div>
                                    <div className="absolute right-2 top-2 flex gap-1">
                                        {!p.hasAudio && <div className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">Muted</div>}
                                        {!p.hasVideo && <div className="bg-gray-600 text-white px-2 py-0.5 rounded text-xs">No Cam</div>}
                                    </div>
                                </div>
                            ))}
                            {participants.filter(p => !p.isLocal).length === 0 && (
                                <div className="col-span-2 flex items-center justify-center text-gray-400">Waiting for participants...</div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <button onClick={toggleMic} disabled={status !== "joined"} className={`px-4 py-2 rounded-md font-semibold ${isMicOn ? "bg-white border" : "bg-yellow-400 text-white"}`}>
                            {isMicOn ? "🎤 Mic On" : "🔇 Mic Off"}
                        </button>
                        <button onClick={toggleCamera} disabled={status !== "joined"} className={`px-4 py-2 rounded-md font-semibold ${isCameraOn ? "bg-white border" : "bg-yellow-400 text-white"}`}>
                            {isCameraOn ? "📷 Camera On" : "📵 Camera Off"}
                        </button>
                        <button onClick={leave} className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold">📞 Leave</button>
                    </div>
                </section>

                {/* Sidebar */}
                <aside className="bg-white rounded shadow p-4">
                    <h3 className="font-semibold mb-3">Participants ({participants.length})</h3>

                    <div className="space-y-3">
                        {/* Local summary */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center font-semibold">You</div>
                            <div className="flex-1">
                                <div className="font-medium">You</div>
                                <div className="text-xs text-gray-500">{isMicOn ? "Microphone On" : "Microphone Off"}</div>
                            </div>
                        </div>

                        {/* Remote list */}
                        {participants.filter(p => !p.isLocal).map(p => (
                            <div key={p.uid} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center font-semibold">{String(p.uid).slice(-2)}</div>
                                <div className="flex-1">
                                    <div className="font-medium">User {shortId(p.uid)}</div>
                                    <div className="text-xs text-gray-500">{p.hasAudio ? "Microphone On" : "Microphone Off"} • {p.hasVideo ? "Camera On" : "Camera Off"}</div>
                                </div>
                            </div>
                        ))}

                        {participants.filter(p => !p.isLocal).length === 0 && (
                            <div className="text-sm text-gray-400">No other participants</div>
                        )}
                    </div>
                </aside>
            </main>

            {/* Permission overlay */}
            {!permissionAsked && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-96 text-center">
                        <h2 className="text-lg font-semibold mb-2">Allow Camera & Microphone</h2>
                        <p className="text-sm text-gray-600 mb-4">This call needs permission to use your camera and microphone. Click allow when your browser asks.</p>

                        {permissionError && <div className="text-sm text-red-600 mb-3">{permissionError}</div>}
                        <div className="flex gap-3 justify-center">
                            <button onClick={requestPermissions} className="px-4 py-2 bg-blue-600 text-white rounded-md">Allow camera & mic</button>
                            <button onClick={() => setPermissionAsked(true)} className="px-4 py-2 border rounded-md">Continue without prompt</button>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">Tip: If you previously blocked, open site permissions in your browser settings.</p>
                    </div>
                </div>
            )}

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 z-40 bg-white/60 flex items-center justify-center">
                    <div className="text-center">
                        <div className="loader mb-2" />
                        <div>Joining the call…</div>
                    </div>
                </div>
            )}
        </div>
    );
}
