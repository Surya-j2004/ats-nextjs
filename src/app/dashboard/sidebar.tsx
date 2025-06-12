"use client";
import Link from "next/link";
import { FileText, Settings, Mail, UserCheck, FileCheck as FileCheckIcon } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
const sidebarOptions = [
  {
    label: "Resume Analysis",
    icon: <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />,
    href: "/dashboard/resume-analysis",
  },
  {
    label: "Set JD",
    icon: <FontAwesomeIcon icon={faFileWord} className="w-5 h-5" />,
    href: "/dashboard/set-jd",
  },
  {
    label: "Upload Resume",
    icon: <FileCheckIcon className="w-5 h-5" />,
    href: "/dashboard/view-resumes",
  },
  {
    label: "View Resumes",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/resumes",
  },
  {
    label: "Set Requirements",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/requirements",
  },
  {
    label: "Offer Letter",
    icon: <Mail className="w-5 h-5" />,
    href: "/dashboard/offer-letters",
  },
  {
    label: "Joining Letters",
    icon: <UserCheck className="w-5 h-5" />,
    href: "/dashboard/joining-letters",
  },
];

export default function Sidebar() {
  return (
    <aside className="bg-gradient-to-b from-blue-700 to-blue-400 text-white w-64 min-h-screen flex flex-col py-8 px-4 shadow-xl">
      <div className="mb-10">
        <div className="text-2xl font-bold mb-2">ATS Dashboard</div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarOptions.map((option) => (
            <li key={option.label}>
              <Link
                href={option.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                {option.icon}
                <span>{option.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
