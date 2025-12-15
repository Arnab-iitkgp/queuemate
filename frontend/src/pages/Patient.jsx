import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { fetchQueueState, setCurrentToken } from "../store/slices/queueSlice";

const socket = io(import.meta.env.VITE_SOCKET_BASE);

export default function Patient() {
  const dispatch = useDispatch();
  const { currentToken, upcomingTokens } = useSelector((state) => state.queue);

  const [myToken, setMyToken] = useState(null);
  const [name, setName] = useState("");

  // // 🧠 Restore token from localStorage (optional for real-life usage)
  // useEffect(() => {
  //   const saved = localStorage.getItem("myToken");
  //   if (saved) setMyToken(Number(saved));
  // }, []);

  // // 💾 Persist token in localStorage (real-life usage)
  // useEffect(() => {
  //   if (myToken !== null) {
  //     localStorage.setItem("myToken", myToken);
  //   }
  // }, [myToken]);

  const handleJoinQueue = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      setMyToken(data.number);
      dispatch(fetchQueueState());
    } catch (err) {
      alert("❌ Could not join the queue. Try again.");
    }
  };

  useEffect(() => {
    dispatch(fetchQueueState());

    socket.on("connect", () => {
      console.log("🧍 Patient connected:", socket.id);
    });

    socket.on("tokenCalled", (data) => {
      dispatch(setCurrentToken(data)); // full object
      dispatch(fetchQueueState());
    });

    return () => {
      socket.off("connect");
      socket.off("tokenCalled");
    };
  }, [dispatch]);

  const getStatus = () => {
    if (!myToken || !currentToken?.number) return "⏳ Waiting for updates...";
    if (myToken === currentToken.number) return "  It's your turn now!";
    if (currentToken.number > myToken) return "🟢 You were already served.";

    const numbers = upcomingTokens.map((t) => t.number);
    const index = numbers.indexOf(myToken);
    return index === -1
      ? "🔄 Waiting for your token to be added..."
      : `⌛ ${index} people ahead of you. (est. time : ${index * 5} min)`;
  };

  return (
    <div className="px-4 py-16 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Patient view
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Join the queue and track your turn
          </h1>
          <p className="text-sm text-slate-600">
            Keep this page open to see live updates as tokens are called.
          </p>
        </div>

        {!myToken ? (
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-3 text-left">
              <label className="block text-sm font-medium text-slate-700">
                Your name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                required
              />
              <button
                onClick={handleJoinQueue}
                className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
                disabled={!name.trim()}
              >
                Join queue
              </button>
            </div>
          </div>
        ) : (
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Your token
              </p>
              <p className="text-4xl font-semibold text-slate-900">#{myToken}</p>
              <p className="mt-1 text-sm text-slate-600">Show this when called.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Currently serving
              </p>
              <p className="text-4xl font-semibold text-slate-900">
                {currentToken?.number ?? "—"}
              </p>
              <p className="mt-1 text-sm text-slate-600">Updates automatically.</p>
            </div>
            <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Status</p>
              <p className="mt-1 text-sm text-slate-700">{getStatus()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
