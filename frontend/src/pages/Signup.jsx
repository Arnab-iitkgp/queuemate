import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice"; // 👈 import Redux action

export default function Signup() {
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch(); // 👈 use Redux dispatch

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/auth/signup`,
        {
          name,
          clinicName,
          email,
          password,
          adminKey,
        }
      );

      //   Use Redux login to store user + token
      dispatch(login({ user: res.data.user, token: res.data.token }));

      //   Redirect
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Admin setup
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Create an admin account
          </h2>
          <p className="text-sm text-slate-600">
            Only authorized staff should proceed. Keep the admin key secure.
          </p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Clinic / Desk Name"
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />
          </div>
          <input
            type="password"
            placeholder="Secret Admin Key"
            className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  );
}
