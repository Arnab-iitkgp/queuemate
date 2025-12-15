import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/login`, {
        email,
        password,
      });

      //   Dispatch login to Redux
      dispatch(login({ user: res.data.user, token: res.data.token }));

      //   Navigate based on role
      if (res.data.user.role === "receptionist") {
        navigate("/receptionist");
      } else if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        alert("Unknown user role");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            QueueMate
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Sign in
          </h2>
          <p className="text-sm text-slate-600">
            Use your work credentials to access the desk.
          </p>
        </div>

        <div className="mb-4 rounded border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-left text-slate-700">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Demo access</p>
              <div className="rounded border border-slate-200 bg-white px-3 py-2 font-mono text-[11px] leading-tight text-slate-800">
                <div>Email: <span className="font-semibold">test@admin.com</span></div>
                <div>Password: <span className="font-semibold">123</span></div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="reception@example.com"
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue
          </button>
        </form>


        <div className="mt-6 space-y-2 text-center text-sm text-slate-600">
          <p>
            Are you an admin?{" "}
            <Link
              to="/signup"
              className="font-semibold text-slate-900 underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
          <p>
            Don’t have an account?{" "}
            <span className="cursor-pointer font-semibold text-slate-900 underline-offset-4 hover:underline">
              Contact admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
