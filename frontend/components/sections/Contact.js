"use client";
import { useState } from "react";
import { Mail, MapPin, Github, Linkedin, Send, Loader2, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/api";

const CONTACT_INFO = [
  { icon: Mail,    label: "Email",    value: "fizxta@gmail.com",   href: "mailto:fizxta@gmail.com" },
  { icon: MapPin,  label: "Location", value: "India",                href: null },
  { icon: Github,  label: "GitHub",   value: "github.com/ziabintahir",  href: "https://github.com/ziabintahir" },
  { icon: Linkedin,label: "LinkedIn", value: "linkedin.com/in/ziaah", href: "https://linkedin.com/in/ziaah" },
];

export default function Contact() {
  const [sent,     setSent]     = useState(false);
  const [sending,  setSending]  = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    try {
      await api.post("/contact", data);
      setSent(true);
      reset();
      toast.success("Message sent! I'll reply within 24–48 hours.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="section-wrapper">
        <div className="mb-16">
          <p className="text-blue-400 font-mono text-sm font-medium mb-2 tracking-wider">// 04. contact</p>
          <h2 className="section-title gradient-text w-fit">Get In Touch</h2>
          <div className="w-12 h-1 bg-blue-600 rounded-full mt-3" />
          <p className="section-subtitle mt-4">
            Have a project in mind, a role to discuss, or just want to say hi? My inbox is always open.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — info */}
          <div className="space-y-6">
            <div className="glass-card p-8 space-y-5">
              <h3 className="text-xl font-bold text-white mb-2">Let&apos;s work together</h3>
              <p className="text-gray-400 leading-relaxed">
                I&apos;m currently open to Backend Developer, DevOps, and Technical Support roles.
                If you have an opportunity that aligns with my skills, I&apos;d love to hear about it.
              </p>

              <div className="space-y-4 pt-2">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-200 hover:text-blue-400 transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-200">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="glass-card p-5 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Available for hire</p>
                <p className="text-gray-400 text-xs">Typical response time: within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="glass-card p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 gap-4">
                <CheckCircle size={48} className="text-green-400" />
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-gray-400">Thanks for reaching out. I&apos;ll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="btn-outline mt-2">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Name *</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Your name"
                      className={`input-field ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Email *</label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                      })}
                      type="email"
                      placeholder="you@company.com"
                      className={`input-field ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Subject</label>
                  <input
                    {...register("subject")}
                    placeholder="Job opportunity / Project / Collaboration"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Message *</label>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                      minLength: { value: 10, message: "Message must be at least 10 characters" },
                    })}
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className={`input-field resize-none ${errors.message ? "border-red-500" : ""}`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
