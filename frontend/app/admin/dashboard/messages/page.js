"use client";
import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Loader2, AlertTriangle, X, Filter } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

function MessageModal({ msg, onClose, onRead }) {
  const markRead = async () => {
    if (!msg.is_read) {
      try {
        await api.patch(`/contact/${msg.id}/read`);
        onRead();
      } catch {}
    }
  };

  useEffect(() => { markRead(); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-700 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-white font-bold">Message from {msg.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">From</p>
              <p className="text-white font-medium">{msg.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Email</p>
              <a href={`mailto:${msg.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                {msg.email}
              </a>
            </div>
            {msg.subject && (
              <div className="col-span-2">
                <p className="text-gray-500 text-xs mb-1">Subject</p>
                <p className="text-white">{msg.subject}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-gray-500 text-xs mb-1">Received</p>
              <p className="text-gray-300 text-xs">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2">Message</p>
            <div className="bg-gray-800/60 rounded-lg p-4 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </div>
          </div>
          <a
            href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your message"}`}
            className="btn-primary w-full justify-center"
          >
            <Mail size={15} /> Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all"); // all | unread | read
  const [selected, setSelected] = useState(null);

  const fetchMessages = () => {
    api.get("/contact")
      .then((r) => setMessages(r.data.data))
      .catch(() => toast.error("Failed to load messages."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const filtered =
    filter === "unread" ? messages.filter((m) => !m.is_read)
    : filter === "read" ? messages.filter((m) => m.is_read)
    : messages;

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 text-sm mt-1">
            {unreadCount > 0
              ? <span className="text-orange-400">{unreadCount} unread</span>
              : "All caught up"
            }
            {" · "}{messages.length} total
          </p>
        </div>
        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
                filter === f
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 size={28} className="text-blue-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-500">No messages found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`glass-card p-5 flex items-start gap-4 cursor-pointer transition-all hover:border-blue-500/40 ${
                !msg.is_read ? "border-blue-500/20 bg-blue-500/5" : ""
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {msg.is_read
                  ? <MailOpen size={18} className="text-gray-500" />
                  : <Mail     size={18} className="text-blue-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-semibold ${msg.is_read ? "text-gray-300" : "text-white"}`}>
                    {msg.name}
                  </span>
                  {!msg.is_read && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  )}
                  <span className="text-gray-600 text-xs ml-auto shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{msg.email}</p>
                {msg.subject && (
                  <p className="text-gray-300 text-sm font-medium mb-1">{msg.subject}</p>
                )}
                <p className="text-gray-400 text-sm truncate">{msg.message}</p>
              </div>
              <button
                onClick={(e) => handleDelete(msg.id, e)}
                className="shrink-0 w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-600 flex items-center justify-center transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <MessageModal
          msg={selected}
          onClose={() => { setSelected(null); fetchMessages(); }}
          onRead={fetchMessages}
        />
      )}
    </div>
  );
}
