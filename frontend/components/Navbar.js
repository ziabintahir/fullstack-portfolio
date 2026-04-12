"use client";
import { useState, useEffect } from "react";
import { Menu, X, Code2, Terminal } from "lucide-react";

const navLinks = [
  { href: "#about",    label: "About"   },
  { href: "#skills",   label: "Skills"  },
  { href: "#projects", label: "Projects"},
  { href: "#contact",  label: "Contact" },
];

export default function Navbar() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [activeLink, setActive]   = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Determine active section
      const sections = navLinks.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActive(id); break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-800/90 backdrop-blur-xl border-b border-gray-800/60 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="font-bold text-white font-mono text-sm">
            zia<span className="text-blue-400">.dev</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`nav-link ${
                  activeLink === href.slice(1) ? "text-white after:w-full" : ""
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm py-2 px-4"
          >
            Resume
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } bg-dark-800/95 backdrop-blur-xl border-b border-gray-800`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors font-medium"
            >
              {label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2.5 rounded-lg text-blue-400 font-semibold border border-blue-500/30 hover:bg-blue-500/10 text-center mt-2 transition-colors"
          >
            Download Resume
          </a>
        </div>
      </div>
    </header>
  );
}
