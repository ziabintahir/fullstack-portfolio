"use client";
import { useEffect, useState } from "react";
import { Server, Monitor, Cloud, Database, Wrench } from "lucide-react";
import api from "@/lib/api";

const CATEGORY_META = {
  backend:  { label: "Backend",   icon: Server,   color: "blue"   },
  frontend: { label: "Frontend",  icon: Monitor,  color: "cyan"   },
  devops:   { label: "DevOps",    icon: Cloud,    color: "purple" },
  database: { label: "Database",  icon: Database, color: "green"  },
  tools:    { label: "Tools",     icon: Wrench,   color: "orange" },
};

const COLOR_MAP = {
  blue:   { bar: "from-blue-500 to-blue-400",     badge: "bg-blue-500/10 text-blue-400 border-blue-500/20"   },
  cyan:   { bar: "from-cyan-500 to-cyan-400",     badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"   },
  purple: { bar: "from-purple-500 to-purple-400", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  green:  { bar: "from-green-500 to-green-400",   badge: "bg-green-500/10 text-green-400 border-green-500/20" },
  orange: { bar: "from-orange-500 to-orange-400", badge: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
};

function SkillBar({ skill, color }) {
  const [width, setWidth] = useState(0);
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;

  useEffect(() => {
    const t = setTimeout(() => setWidth(skill.level), 300);
    return () => clearTimeout(t);
  }, [skill.level]);

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">
          {skill.name}
        </span>
        <span className="text-xs text-gray-500 font-mono">{skill.level}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className={`skill-bar-fill bg-gradient-to-r ${colors.bar}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// Fallback static data if API is unavailable
const FALLBACK = {
  backend:  [
    { id:1, name:"Node.js",     level:90 }, { id:2, name:"Express.js",  level:88 },
    { id:3, name:"REST APIs",   level:90 }, { id:4, name:"JWT Auth",     level:85 },
    { id:5, name:"Python",      level:75 },
  ],
  frontend: [
    { id:6, name:"Next.js",     level:80 }, { id:7, name:"React.js",    level:80 },
    { id:8, name:"Tailwind CSS",level:85 }, { id:9, name:"JavaScript",  level:88 },
  ],
  devops:   [
    { id:10, name:"Docker",          level:85 }, { id:11, name:"Docker Compose", level:83 },
    { id:12, name:"GitHub Actions",  level:80 }, { id:13, name:"Linux/Bash",     level:85 },
    { id:14, name:"Nginx",           level:78 }, { id:15, name:"AWS (EC2/S3)",   level:72 },
  ],
  database: [
    { id:16, name:"MySQL",      level:87 }, { id:17, name:"PostgreSQL", level:75 },
    { id:18, name:"Redis",      level:70 }, { id:19, name:"MongoDB",    level:72 },
  ],
  tools:    [
    { id:20, name:"Git",     level:92 }, { id:21, name:"Postman", level:90 },
    { id:22, name:"Swagger", level:80 },
  ],
};

export default function Skills() {
  const [skills,    setSkills]    = useState(FALLBACK);
  const [activeTab, setActiveTab] = useState("backend");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.get("/skills")
      .then((r) => { if (Object.keys(r.data.data).length) setSkills(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = Object.keys(CATEGORY_META).filter((c) => skills[c]?.length);
  const activeColor = CATEGORY_META[activeTab]?.color || "blue";

  return (
    <section id="skills" className="relative py-24">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="section-wrapper">
        <div className="mb-16">
          <p className="text-blue-400 font-mono text-sm font-medium mb-2 tracking-wider">// 02. skills</p>
          <h2 className="section-title gradient-text w-fit">Technical Skills</h2>
          <div className="w-12 h-1 bg-blue-600 rounded-full mt-3" />
          <p className="section-subtitle mt-4">
            A categorised overview of my technical proficiencies, from backend development to DevOps automation.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const { label, icon: Icon } = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  activeTab === cat
                    ? "bg-blue-600 border-blue-500 text-white shadow-glow"
                    : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {(skills[activeTab] || []).map((skill) => (
            <div key={skill.id} className="glass-card p-5">
              <SkillBar skill={skill} color={activeColor} />
            </div>
          ))}
        </div>

        {/* All tech badges (decoration) */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-4">Also familiar with</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Swagger","Redis","RabbitMQ","WebSockets","Sequelize","Prisma",
              "PM2","Certbot","Let's Encrypt","AWS S3","Render","Vercel","cPanel",
            ].map((t) => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
