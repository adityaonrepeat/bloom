import { useSelector } from "react-redux";
import { findMatch } from "../services/authService";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";

const Match = () => {
  const user = useSelector((state) => state.nav.user);

  const [connectionId, setConnectionId] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [status, setStatus] = useState("Searching for a match...");
  const zpRef = useRef(null);

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

  const joinRoom = async (element) => {
    if (!element || !connectionId || !user) return;

    const appId = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

    const userId = user.uid;
    const userName = user.displayName || "User_" + userId.substring(0, 4);

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      connectionId,
      userId,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: element,
      showPreJoinView: false,
      showMyCameraToggleButton: false,
      showTurnOffRemoteCameraButton: false,
      showMyMicrophoneToggleButton: false,
      showLayoutButton: false,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      showTextChat: false,
      showUserList: false,

      onJoinRoom: () => {
        setStatus("Connected");
      },

      onLeaveRoom: () => {
        setConnectionId(null);
        setMatchedUser(null);
        setStatus("Searching for a match...");
      },
    });
  };

  return (
    <div className="px-3 py-5 flex flex-col sm:flex-row justify-between sm:h-[88vh] gap-3 sm:gap-0">
      <div className="h-full sm:w-[27%] flex flex-col gap-3">
        <div className="w-full bg-slate-800 h-[80vh] sm:h-full rounded-lg overflow-hidden relative border-2 border-slate-700">
          {connectionId ? (
            <div ref={joinRoom} className="w-full h-full"></div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">{status}</p>
              <p className="text-sm text-slate-400 mt-2">
                Please wait while we find someone for you to talk to.
              </p>
            </div>
          )}
        </div>

        {!connectionId ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Bloom
            </h2>
            <p className="text-gray-600">
              Click "NEW" to find a new person to talk to.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="p-3 border-b bg-gray-50 rounded-t-lg border-gray-300 flex flex-col items-center justify-center p-4">
              {!connectionId ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome to Bloom
                  </h2>
                  <p className="text-gray-600">
                    Click "NEW" to find a new person to chat with.
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  <div className="p-3 border-b bg-gray-50 rounded-t-lg border-gray-300">
                    <span className="font-semibold text-gray-700">
                      Chatting with:{" "}
                    </span>
                    <span className="text-blue-600 font-medium">
                      {matchedUser?.displayName || "Stranger"}
                    </span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto bg-white italic text-gray-400 flex items-center justify-center">
                    Chat feature coming soon...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-full sm:w-[72%] flex flex-col gap-3 rounded-lg">
        <div className="w-full bg-white h-[50vh] sm:h-[90%] border rounded-lg border-gray-300 flex flex-col items-center justify-center p-4">
          {!connectionId ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Bloom
              </h2>
              <p className="text-gray-600">
                Click "NEW" to find a new person to chat with.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="p-3 border-b bg-gray-50 rounded-t-lg border-gray-300">
                <span className="font-semibold text-gray-700">
                  Chatting with:{" "}
                </span>
                <span className="text-blue-600 font-medium">
                  {matchedUser?.displayName || "Stranger"}
                </span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-white italic text-gray-400 flex items-center justify-center">
                Chat feature coming soon...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-between">
          <button className="w-[50%] h-full mx-auto px-5 py-4 bg-gradient-to-b from-green-600 bg-green-600 text-white rounded-md text-md border-green-600 border text-center hidden md:block opacity-50 cursor-not-allowed">
            Talk to Bloom AI
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="w-[50%] h-full mx-auto px-5 py-4 bg-gradient-to-b from-blue-300 to-blue-400 text-white rounded-md text-md border-blue-400 border text-center hidden md:block"
          >
            NEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Match;