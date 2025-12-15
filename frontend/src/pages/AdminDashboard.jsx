import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReceptionists,
  createReceptionist,
  deleteReceptionist,
} from "../store/slices/receptionistSlice";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.auth.user);
  const {
    list: receptionists,
    loading,
    error,
  } = useSelector((state) => state.receptionists);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Fetch receptionists on mount
  useEffect(() => {
    dispatch(fetchReceptionists());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateReceptionist = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createReceptionist(form)).unwrap();
      alert("  Receptionist created!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteReceptionist(id)).unwrap();
      alert("🗑️ Receptionist deleted!");
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Admin
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome, {admin?.name}
            </h1>
            <p className="text-sm text-slate-600">Clinic: {admin?.clinicName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/receptionist"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400"
            >
              Reception desk
            </Link>
            <Link
              to="/"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Patient entry
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Receptionist List */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Staff
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Receptionists
                </h2>
              </div>
              {loading && (
                <span className="text-xs font-medium text-slate-500">
                  Loading…
                </span>
              )}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50">
              {receptionists.map((r) => (
                <li
                  key={r._id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-slate-800"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-600">{r.email}</p>
                  </div>
                  <button
                    className="text-xs font-semibold text-red-700 underline-offset-2 hover:underline"
                    onClick={() => handleDelete(r._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              {receptionists.length === 0 && (
                <li className="px-4 py-3 text-sm text-slate-600">
                  No receptionists added yet.
                </li>
              )}
            </ul>
          </section>

          {/* Add Receptionist */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Access
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Add receptionist
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Create a desk account with a temporary password.
            </p>
            <form
              onSubmit={handleCreateReceptionist}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Work email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Temporary password"
                value={form.password}
                onChange={handleChange}
                className="sm:col-span-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="sm:col-span-2 rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create receptionist
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
