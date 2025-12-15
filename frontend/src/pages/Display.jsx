import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
const socket = io(import.meta.env.VITE_SOCKET_BASE);

export default function Display() {
  const [currentToken, setCurrentToken] = useState(null);

  useEffect(() => {
    // Fetch last called token on first load
    const fetchCurrent = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/token/current`
        );
        const data = await res.json();
        setCurrentToken(data.number);
      } catch (err) {
        console.log("No token has been called yet.");
      }
    };

    fetchCurrent();

    socket.on("connect", () => {
      console.log("🖥️ Display connected:", socket.id);
    });

    socket.on("tokenCalled", (data) => {
      setCurrentToken(data.number);
      console.log("📡 tokenCalled (Display):", data.number);
    });

    return () => {
      socket.off("connect");
      socket.off("tokenCalled");
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-neutral-950 text-white">
      <Link
        to="/"
        className="absolute left-4 top-4 rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition hover:border-neutral-500"
      >
        Exit
      </Link>

      <div className="m-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">
          Now serving
        </p>
        {currentToken ? (
          <div className="text-[120px] font-semibold leading-none text-white sm:text-[160px]">
            #{currentToken}
          </div>
        ) : (
          <div className="text-2xl text-neutral-400">
            Waiting for first token…
          </div>
        )}
        <p className="text-sm text-neutral-500">Please proceed when your number appears.</p>
      </div>
    </div>
  );
}
