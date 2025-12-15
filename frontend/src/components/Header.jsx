import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 text-slate-900">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md  text-sm font-semibold uppercase tracking-wide text-white">
            <img src="/logo.png" alt="QueueMate" className="h-10 w-10" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              QueueMate
            </p>
            <p className="text-xs text-slate-500">Real-time queue control</p>
          </div>
        </Link>

        {/* Right Section */}
        {user && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {user.role}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-semibold uppercase">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {user.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="hidden rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 sm:inline-flex"
              >
                Dashboard
              </Link>
            )}

            <LogoutButton onClick={handleLogout} />
          </div>
        )}
      </div>
    </header>
  );
}
