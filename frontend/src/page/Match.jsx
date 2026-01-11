import { useSelector } from "react-redux";
import { findMatch } from "../services/authService";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Match = () => {
  const user = useSelector((state) => state.nav.user);

  const [connectionId, setConnectionId] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [status, setStatus] = useState("Searching for a match...");

  const containerRef = useRef(null);
  const zpRef = useRef(null);
  const navigate = useNavigate();

  /* ---------------- MATCH POLLING ---------------- */
  useEffect(() => {
    if (!user || connectionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await findMatch(user.uid);
        if (res?.data?.connectionId) {
          setConnectionId(res.data.connectionId);
          setMatchedUser(res.data.matchedUser);
          clearInterval(interval);
        }
      } catch (error) {
        console.log("Polling error:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, connectionId]);

  /* ---------------- JOIN ROOM ---------------- */
  useEffect(() => {
    if (!connectionId || !containerRef.current || zpRef.current) return;

    const joinRoom = async () => {
      const appId = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

      const userId = user.uid;
      const userName =
        user.displayName || `User_${userId.slice(0, 4)}`;

      const kitToken =
        ZegoUIKitPrebuilt.generateKitTokenForTest(
          appId,
          serverSecret,
          connectionId,
          userId,
          userName
        );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      zp.joinRoom({
        container: containerRef.current,

        /* ✅ Keep Zego UI controls */
        showPreJoinView: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showTurnOffRemoteCameraButton: true,
        showLayoutButton: true,
        showTextChat: true,
        showUserList: true,

        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },

        onJoinRoom: () => {
          setStatus("Connected");
        },

        onLeaveRoom: () => {
          cleanupRoom();
        },
      });
    };

    joinRoom();
  }, [connectionId, user]);

  /* ---------------- CLEANUP ---------------- */
  const cleanupRoom = () => {
    if (zpRef.current) {
      zpRef.current.destroy();
      zpRef.current = null;
    }

    setConnectionId(null);
    setMatchedUser(null);
    setStatus("Searching for a match...");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* 🎥 CAMERA — DOUBLE SIZE */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative h-[80vh] shadow-lg">
          {connectionId ? (
            <div ref={containerRef} className="w-full h-full" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <div className="w-14 h-14 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xl font-medium">{status}</p>
              <p className="text-sm text-slate-400 mt-2">
                Please wait while we find someone for you.
              </p>
            </div>
          )}
        </div>

        {/* 💬 SIDE PANEL */}
        <div className="lg:col-span-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden h-[80vh] shadow-md">

          {/* HEADER */}
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">
              {connectionId ? "Connected" : "Welcome to Bloom"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {connectionId
                ? `Chatting with ${matchedUser?.displayName || "Stranger"}`
                : "Click NEW to find someone"}
            </p>
          </div>

          {/* BODY */}
          <div className="flex-1 flex items-center justify-center text-gray-400 italic text-center px-4">
            Chat feature coming soon...
          </div>

          {/* ACTIONS */}
          <div className="p-4 border-t bg-gray-50 flex flex-col gap-3">
            <button
              onClick={() => navigate("/chat")}
              className="w-full py-3 rounded-md bg-green-400 text-white hover:bg-green-500 transition"
            >
              Talk to Aastha
            </button>

            <button
              onClick={cleanupRoom}
              className="w-full py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              NEW
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Match;
