"use client";
import { useEffect, useState } from "react";
import { FolderKanban, MessageSquare, Eye, TrendingUp, Plus, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={17} />
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-extrabold text-white">{value}</p>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState({ projects: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [recent,  setRecent]  = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/contact"),
    ])
      .then(([pRes, cRes]) => {
        const projects  = pRes.data.data;
        const messages  = cRes.data.data;
        const unread    = messages.filter((m) => !m.is_read).length;
        setStats({ projects: projects.length, messages: messages.length, unread });
        setRecent(messages.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">
          {greeting()}, <span className="gradient-text">{user?.username}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1">Here&apos;s an overview of your portfolio.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={stats.projects}
          color="bg-blue-500/10 text-blue-400"
          loading={loading}
        />
        <StatCard
          icon={MessageSquare}
          label="Total Messages"
          value={stats.messages}
          color="bg-purple-500/10 text-purple-400"
          loading={loading}
        />
        <StatCard
          icon={Eye}
          label="Unread Messages"
          value={stats.unread}
          color="bg-orange-500/10 text-orange-400"
          loading={loading}
        />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <Link
          href="/admin/dashboard/projects"
          className="glass-card p-5 flex items-center gap-4 group hover:border-blue-500/40 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
            <Plus size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Add New Project</p>
            <p className="text-gray-500 text-sm">Publish a new project to your portfolio</p>
          </div>
          <ArrowRight size={16} className="text-gray-600 ml-auto group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link
          href="/admin/dashboard/messages"
          className="glass-card p-5 flex items-center gap-4 group hover:border-purple-500/40 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
            <MessageSquare size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="text-white font-semibold">View Messages</p>
            <p className="text-gray-500 text-sm">
              {stats.unread > 0
                ? <span className="text-orange-400 font-medium">{stats.unread} unread message{stats.unread !== 1 ? "s" : ""}</span>
                : "No new messages"
              }
            </p>
          </div>
          <ArrowRight size={16} className="text-gray-600 ml-auto group-hover:text-purple-400 transition-colors" />
        </Link>
      </div>

      {/* Recent messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
          <Link href="/admin/dashboard/messages" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="h-16 glass-card animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-500">No messages yet.</div>
        ) : (
          <div className="space-y-3">
            {recent.map((msg) => (
              <div key={msg.id} className="glass-card p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
                    {msg.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{msg.name}</p>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{msg.email}</p>
                    <p className="text-gray-400 text-sm mt-1 truncate">{msg.message}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs shrink-0">
                  {new Date(msg.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
