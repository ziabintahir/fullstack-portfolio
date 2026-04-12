"use client";
import { Github, Linkedin, Mail, Terminal, Heart } from "lucide-react";

const NAV = [
  { href: "#about",    label: "About"    },
  { href: "#skills",   label: "Skills"   },
  { href: "#projects", label: "Projects" },
  { href: "#contact",  label: "Contact"  },
];

const SOCIAL = [
  { href: "https://github.com/ziabintahir",         icon: Github,   label: "GitHub"   },
  { href: "https://linkedin.com/in/ziaah/",    icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:fizxta@gmail.com",           icon: Mail,     label: "Email"    },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-800/60 bg-dark-800/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                <Terminal size={13} className="text-white" />
              </div>
              <span className="font-bold font-mono text-sm">
                zia<span className="text-blue-400">.dev</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Backend Developer & DevOps Engineer. Building scalable systems, one commit at a time.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Navigation</p>
            <ul className="space-y-2">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Connect</p>
            <div className="flex gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center
                             text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-4">
              <a href="mailto:fizxta@gmail.com" className="hover:text-blue-400 transition-colors">
                fizxta@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {year} Zia Ahmad. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart size={11} className="text-red-500 fill-red-500" /> using
            <span className="text-gray-500">Next.js · Tailwind · Node.js · MySQL · Docker</span>
          </p>
          <a href="/admin/login" className="text-gray-700 hover:text-gray-500 transition-colors">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
