"use client";
import { User, MapPin, Briefcase, GraduationCap, Coffee, Code2 } from "lucide-react";

const stats = [
  { label: " (Self Projects) 2023 – Present", value: "Software Developer",   icon: Briefcase  },
  { label: "Projects Built",   value: "15+",  icon: Code2      },
  { label: "Technologies",     value: "20+",  icon: Coffee     },
  { label: "Cups of Coffee",   value: "∞",    icon: Coffee     },
];

const highlights = [
  { icon: MapPin,       text: "India" },
  { icon: Briefcase,    text: "Available for remote & on-site" },
  { icon: GraduationCap, text: "MCA -Computer Science - Aligarh Muslim University" },
  { icon: GraduationCap, text: "BSC - Mathematics - Aligarh Muslim University" },
];

export default function About() {
  return (
    <section id="about" className="relative py-24">
      {/* Subtle separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="section-wrapper">
        {/* Header */}
        <div className="mb-16">
          <p className="text-blue-400 font-mono text-sm font-medium mb-2 tracking-wider">// 01. about</p>
          <h2 className="section-title gradient-text w-fit">About Me</h2>
          <div className="w-12 h-1 bg-blue-600 rounded-full mt-3" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — text content */}
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p className="text-lg">
              I&apos;m a{" "}
              <span className="text-white font-semibold">Backend & DevOps Engineer</span>{" "}
              who loves turning complex requirements into clean, scalable, production-ready systems.
              My core strength lies in designing robust REST APIs, building reliable server-side
              architectures, and shipping applications through repeatable DevOps pipelines.
            </p>
            <p>
              I work primarily with <span className="text-blue-400 font-medium">Node.js + Express</span> on
              the backend, <span className="text-blue-400 font-medium">MySQL / PostgreSQL</span> for data
              persistence, and <span className="text-blue-400 font-medium">Docker + GitHub Actions</span> for
              CI/CD. On the frontend side I use <span className="text-blue-400 font-medium">Next.js</span>{" "}
              and Tailwind CSS when the project demands it.
            </p>
            <p>
              I&apos;m driven by a deep interest in{" "}
              <span className="text-white font-medium">system design</span>,{" "}
              <span className="text-white font-medium">API security</span>, and
              writing code that&apos;s maintainable six months from now.
              Outside of code I contribute to open source, read engineering blogs, and
              constantly experiment with new tools and infra patterns.
            </p>

            {/* Quick highlights */}
            <div className="flex flex-wrap gap-4 pt-2">
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={14} className="text-blue-400 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <a href="#contact" className="btn-primary">
                Hire Me
              </a>
              <a
                href="https://github.com/ziabintahir"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                GitHub Profile →
              </a>
            </div>
          </div>

          {/* Right — stats + info card */}
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="glass-card p-5 text-center group">
                  <div className="text-3xl font-extrabold gradient-text mb-1">{value}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>

            {/* What I do card */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <User size={16} className="text-blue-400" /> What I Do
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  "Design & build scalable REST APIs with Node.js + Express",
                  "Schema design & query optimisation with MySQL / PostgreSQL",
                  "Containerise applications with Docker & Docker Compose",
                  "Automate CI/CD pipelines with GitHub Actions",
                  "Deploy to cloud platforms (AWS EC2, Render, Vercel)",
                  "Implement JWT auth, rate limiting & API security best practices",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
