import { Link } from "react-router-dom";

export default function RoleCard({ role, link, color, description, badge }) {
  return (
    <Link
      to={link}
      className="group relative block h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-md text-sm font-semibold uppercase tracking-wide text-white ${color}`}
        >
          {role.slice(0, 2)}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-slate-900">{role}</h2>
            {badge && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium tracking-tight text-slate-600">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{description}</p>
          <div className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
            Open
          </div>
        </div>
      </div>
    </Link>
  );
}