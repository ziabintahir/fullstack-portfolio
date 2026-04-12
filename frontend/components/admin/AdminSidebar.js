"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, Terminal, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard",          icon: LayoutDashboard, label: "Dashboard"  },
  { href: "/admin/dashboard/projects", icon: FolderKanban,    label: "Projects"   },
  { href: "/admin/dashboard/messages", icon: MessageSquare,   label: "Messages"   },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 bg-dark-800 border-r border-gray-800 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-glow">
            <Terminal size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm font-mono">zia.dev</p>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <ExternalLink size={16} /> View Portfolio
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>

        {/* User badge */}
        <div className="mt-3 px-3 py-2 rounded-lg bg-gray-800/50 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.username?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.username}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
