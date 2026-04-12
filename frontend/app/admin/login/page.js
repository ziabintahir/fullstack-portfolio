"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Terminal, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { login } = useAuth();
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ username, password }) => {
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back!");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass-card p-8 shadow-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 items-center justify-center mb-4 shadow-glow">
              <Terminal size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Portfolio Dashboard — Protected Access</p>
          </div>

          {/* Security notice */}
          <div className="flex items-center gap-2 bg-blue-500/8 border border-blue-500/20 rounded-lg px-4 py-3 mb-6 text-sm text-blue-300">
            <ShieldCheck size={15} className="shrink-0" />
            JWT-secured session · Rate-limited endpoint
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">Username / Email</label>
              <input
                {...register("username", { required: "Username is required" })}
                placeholder="zia_admin"
                autoComplete="username"
                className={`input-field ${errors.username ? "border-red-500" : ""}`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <input
                  {...register("password", { required: "Password is required" })}
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-field pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            <a href="/" className="hover:text-gray-400 transition-colors">← Back to portfolio</a>
          </p>
        </div>
      </div>
    </div>
  );
}
