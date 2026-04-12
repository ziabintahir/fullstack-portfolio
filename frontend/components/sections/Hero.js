"use client";
import { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail, Terminal, Download, ChevronRight } from "lucide-react";

const ROLES = [
  "Backend Developer",
  "DevOps Engineer",
  "Node.js Specialist",
  "API Architect",
  "Full-Stack Developer",
];

export default function Hero() {
  const [roleIdx, setRoleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping]     = useState(true);
  const [charIdx, setCharIdx]   = useState(0);

  // Typewriter effect
  useEffect(() => {
    const current = ROLES[roleIdx];
    if (typing) {
      if (charIdx < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, 80);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, 45);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((r) => (r + 1) % ROLES.length);
        setTyping(true);
      }
    }
  }, [charIdx, typing, roleIdx]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-grid"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Open to opportunities
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
          Hi, I&apos;m{" "}
          <span className="gradient-text">Zia Ahmad</span>
        </h1>

        {/* Typewriter role */}
        <div className="text-2xl sm:text-3xl font-bold text-gray-300 mb-6 h-10 flex items-center justify-center gap-0">
          <span className="text-blue-400 font-mono">&gt;</span>
          &nbsp;
          <span>{displayed}</span>
          <span className="w-0.5 h-7 bg-blue-400 ml-1 animate-pulse" />
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Building scalable backend systems, RESTful APIs, and production-grade DevOps pipelines.
          Passionate about clean architecture, containerisation, and shipping things that{" "}
          <span className="text-blue-400 font-semibold">actually work in prod</span>.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a href="#projects" className="btn-primary text-base px-8 py-3.5">
            View Projects <ChevronRight size={18} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-base px-8 py-3.5"
          >
            <Download size={18} /> Download Resume
          </a>
          <a href="#contact" className="btn-ghost text-base">
            Get In Touch
          </a>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-5">
          {[
            { href: "https://github.com/ziabintahir", icon: Github,   label: "GitHub"   },
            { href: "https://linkedin.com/in/ziaah/", icon: Linkedin, label: "LinkedIn" },
            { href: "mailto:fizxta@gmail.com", icon: Mail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-lg bg-gray-800/60 border border-gray-700 flex items-center justify-center
                         text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10
                         transition-all duration-200 hover:scale-110"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Tech stack strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
          <Terminal size={12} className="text-blue-500" />
          {["Node.js", "Express", "MySQL", "Docker", "Next.js", "REST APIs", "JWT", "Linux"].map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-gray-800/60 border border-gray-700/60 text-gray-400 font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1
                   text-gray-500 hover:text-blue-400 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ArrowDown size={16} />
      </a>
    </section>
  );
}
