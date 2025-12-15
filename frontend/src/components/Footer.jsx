import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} QueueMate. Built for calm, dependable
          operations.
        </p>

        <div className="flex justify-center gap-4 text-slate-500 sm:justify-end">
          <a
            href="https://github.com/Arnab-iitkgp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-slate-800"
          >
            <FaGithub aria-hidden /> GitHub
          </a>
          <a
            href="mailto:mrarnab7475@gmail.com"
            className="flex items-center gap-2 transition hover:text-slate-800"
          >
            <HiOutlineMail aria-hidden /> Email
          </a>
          <a
            href="https://www.linkedin.com/in/Arnab-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-slate-800"
          >
            <FaLinkedin aria-hidden /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
