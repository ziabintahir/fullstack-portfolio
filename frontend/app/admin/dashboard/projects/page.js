"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Save, Star, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/api";

const CATEGORIES = ["backend", "frontend", "fullstack", "devops"];

// ─── Project Form Modal ──────────────────────────────────────────
function ProjectModal({ project, onClose, onSaved }) {
  const isEdit = Boolean(project?.id);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: project
      ? {
          ...project,
          tech_stack: Array.isArray(project.tech_stack)
            ? project.tech_stack.join(", ")
            : project.tech_stack,
        }
      : { category: "fullstack", featured: false, sort_order: 0 },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        tech_stack: data.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
        featured: Boolean(data.featured),
        sort_order: Number(data.sort_order) || 0,
      };

      if (isEdit) {
        await api.put(`/projects/${project.id}`, payload);
        toast.success("Project updated!");
      } else {
        await api.post("/projects", payload);
        toast.success("Project created!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-700 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? "Edit Project" : "Add New Project"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="My Awesome Project"
              className={`input-field ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">Description *</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows={3}
              placeholder="What does this project do and why is it impressive?"
              className={`input-field resize-none ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">
              Tech Stack * <span className="text-gray-500 font-normal">(comma-separated)</span>
            </label>
            <input
              {...register("tech_stack", { required: "Tech stack is required" })}
              placeholder="Node.js, Express.js, MySQL, Docker"
              className={`input-field ${errors.tech_stack ? "border-red-500" : ""}`}
            />
            {errors.tech_stack && <p className="text-red-400 text-xs mt-1">{errors.tech_stack.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">GitHub URL</label>
              <input
                {...register("github_url")}
                placeholder="https://github.com/..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">Live URL</label>
              <input
                {...register("live_url")}
                placeholder="https://myproject.com"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">Category *</label>
              <select
                {...register("category", { required: true })}
                className="input-field capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-gray-800 capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">Sort Order</label>
              <input
                {...register("sort_order")}
                type="number"
                min="0"
                placeholder="0"
                className="input-field"
              />
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  {...register("featured")}
                  type="checkbox"
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <span className="text-sm text-gray-300 font-medium flex items-center gap-1">
                  <Star size={13} className="text-yellow-400" /> Featured
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost px-6">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────
function DeleteModal({ project, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${project.id}`);
      toast.success("Project deleted.");
      onDeleted();
      onClose();
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-700 border border-red-900/50 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Delete Project</h2>
        </div>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">"{project.title}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors disabled:opacity-60"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // null | { type: "add"|"edit"|"delete", project? }

  const fetchProjects = () => {
    setLoading(true);
    api.get("/projects")
      .then((r) => setProjects(r.data.data))
      .catch(() => toast.error("Failed to load projects."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">{projects.length} total project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setModal({ type: "add" })} className="btn-primary">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24"><Loader2 size={28} className="text-blue-500 animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500 mb-4">No projects yet.</p>
          <button onClick={() => setModal({ type: "add" })} className="btn-primary">
            <Plus size={16} /> Create your first project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="glass-card p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold truncate">{p.title}</h3>
                  {p.featured && <Star size={13} className="text-yellow-400 fill-yellow-400 shrink-0" />}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize shrink-0">
                    {p.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-1 mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(p.tech_stack) ? p.tech_stack : []).slice(0, 5).map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setModal({ type: "edit", project: p })}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 flex items-center justify-center transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setModal({ type: "delete", project: p })}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 flex items-center justify-center transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {modal?.type === "add" && (
        <ProjectModal onClose={() => setModal(null)} onSaved={fetchProjects} />
      )}
      {modal?.type === "edit" && (
        <ProjectModal project={modal.project} onClose={() => setModal(null)} onSaved={fetchProjects} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal project={modal.project} onClose={() => setModal(null)} onDeleted={fetchProjects} />
      )}
    </div>
  );
}
