import RoleCard from "./components/RoleCard";
import { Toaster } from "react-hot-toast"; // 👈 import here

const roles = [
  {
    role: "Admin / Desk",
    link: "/receptionist",
    color: "bg-slate-800",
    description: "Manage the live queue and coordinate desks.",
    badge: "Authorized access",
  },
  {
    role: "Patient",
    link: "/patient",
    color: "bg-emerald-800",
    description: "Take a token and track your turn in real time.",
    badge: "Walk-in",
  },
  {
    role: "Display",
    link: "/display",
    color: "bg-amber-800",
    description: "Show the now-serving screen for waiting areas.",
    badge: "Public view",
  },
];

export default function App() {
  return (
    <>
      {/* 🔔 Global toast system */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Welcome
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Reliable Queue Management for daily operations

          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Select your role to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((item) => (
            <RoleCard key={item.role} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}
