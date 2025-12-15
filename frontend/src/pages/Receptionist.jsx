import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";
import {
  fetchQueueState,
  setCurrentToken,
  resetQueue as resetQueueState,
} from "../store/slices/queueSlice";

const socket = io(import.meta.env.VITE_SOCKET_BASE);

export default function Receptionist() {
  const dispatch = useDispatch();
  const { currentToken, upcomingTokens, loading, error } = useSelector(
    (state) => state.queue
  );

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleCallNext = async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/token/call`,
        {},
        authHeaders
      );
      dispatch(setCurrentToken(res.data));
      dispatch(fetchQueueState());
      toast.success(`📞 Called Token #${res.data.number}`);
    } catch (err) {
      console.error("❌ Error calling token:", err.message);
      toast.error(err?.response?.data?.message || "Failed to call token");
    }
  };

  const handleResetQueue = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the queue?"
    );
    if (!confirmReset) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/token/reset`,
        authHeaders
      );
      dispatch(resetQueueState());
      toast.success("🧹 Queue has been reset");
    } catch (err) {
      console.error("❌ Failed to reset queue.");
      toast.error("Reset failed");
    }
  };

  useEffect(() => {
    dispatch(fetchQueueState());

    socket.on("connect", () => {
      console.log("👩‍💼 Receptionist connected:", socket.id);
    });

    socket.on("tokenCalled", (data) => {
      dispatch(setCurrentToken(data));
      dispatch(fetchQueueState());
    });

    socket.on("newToken", () => {
      dispatch(fetchQueueState());
    });

    return () => {
      socket.off("connect");
      socket.off("tokenCalled");
      socket.off("newToken");
    };
  }, [dispatch]);

  return (
    <div className="px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Reception
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Queue control
            </h1>
            <p className="text-sm text-slate-600">
              Call the next patient and keep the waiting area informed.
            </p>
          </div>
          {userRole === "admin" && (
            <button
              onClick={handleResetQueue}
              className="self-start rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400"
            >
              Reset queue
            </button>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Now serving
                </p>
                {currentToken ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-semibold text-slate-900">
                      #{currentToken.number}
                    </span>
                    <span className="text-sm text-slate-600">
                      {currentToken.name}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    No token has been called yet.
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCallNext}
                  className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
                  disabled={loading}
                >
                  {loading ? "Calling…" : "Call next patient"}
                </button>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Queue
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Upcoming tokens
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {upcomingTokens.length} waiting
              </span>
            </div>
            {upcomingTokens.length > 0 ? (
              <div className="mt-4 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: "18rem" }}>
                {upcomingTokens.map((tokenObj, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800"
                  >
                    <span className="text-lg font-semibold">#{tokenObj.number}</span>
                    <span className="text-sm text-slate-600">{tokenObj.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">No tokens in queue.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
