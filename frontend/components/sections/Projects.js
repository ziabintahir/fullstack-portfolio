"use client";
import { useEffect, useState } from "react";
import { Github, ExternalLink, Loader2, Code2, Server, Cloud, Layout } from "lucide-react";
import api from "@/lib/api";

const CATEGORY_LABELS = {
  backend:   { label: "Backend",   icon: Server, color: "blue"   },
  frontend:  { label: "Frontend",  icon: Layout, color: "cyan"   },
  fullstack: { label: "Full Stack",icon: Code2,  color: "purple" },
  devops:    { label: "DevOps",    icon: Cloud,  color: "green"  },
};

const FILTER_TABS = ["all", "backend", "fullstack", "devops", "frontend"];

function ProjectCard({ project }) {
  const catMeta = CATEGORY_LABELS[project.category] || CATEGORY_LABELS.fullstack;
  const Icon = catMeta.icon;

  return (
    <div className="glass-card p-6 flex flex-col h-full group hover:scale-[1.02] transition-transform duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center`}>
          <Icon size={18} className="text-blue-400" />
        </div>
        <div className="flex items-center gap-2">
          {project.featured && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
              ⭐ Featured
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
            bg-blue-500/10 text-blue-300 border border-blue-500/20`}>
            {catMeta.label}
          </span>
        </div>
      </div>

      {/* Title + description */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
        {project.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
        {project.description}
      </p>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {(Array.isArray(project.tech_stack) ? project.tech_stack : []).map((tech) => (
          <span key={tech} className="tech-badge">{tech}</span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 mt-auto">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Github size={15} /> Code
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={15} /> Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    api.get("/projects")
      .then((r) => setProjects(r.data.data))
      .catch(() => setError("Could not load projects. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="section-wrapper">
        <div className="mb-16">
          <p className="text-blue-400 font-mono text-sm font-medium mb-2 tracking-wider">// 03. projects</p>
          <h2 className="section-title gradient-text w-fit">Featured Projects</h2>
          <div className="w-12 h-1 bg-blue-600 rounded-full mt-3" />
          <p className="section-subtitle mt-4">
            A selection of production-grade projects that demonstrate my backend, DevOps, and full-stack capabilities.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize border ${
                filter === tab
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              {tab === "all" ? "All Projects" : CATEGORY_LABELS[tab]?.label || tab}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-gray-500">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No projects found in this category yet.
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="https://github.com/ziabintahir"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex"
          >
            <Github size={16} /> View all on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
