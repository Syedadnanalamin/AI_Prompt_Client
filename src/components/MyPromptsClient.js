"use client"

import { useState } from "react";
import { 
    Trash2, Edit, BarChart3, Eye, Check, X, 
    CheckCircle2, XCircle, AlertCircle, Bookmark, Star, Copy 
} from "lucide-react";
import { deletePromptAction, updatePromptAction } from "@/lib/actions";
import toast from "react-hot-toast";

export default function MyPromptsClient({ initialPrompts = [] }) {
    const [prompts, setPrompts] = useState(initialPrompts);
    const [loadingId, setLoadingId] = useState(null);

    // Edit Modal State
    const [editPrompt, setEditPrompt] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editModel, setEditModel] = useState("");
    const [editTags, setEditTags] = useState("");
    const [editDifficulty, setEditDifficulty] = useState("");
    const [editVisibility, setEditVisibility] = useState("");
    const [submittingEdit, setSubmittingEdit] = useState(false);

    // Analytics Modal State
    const [analyticsPrompt, setAnalyticsPrompt] = useState(null);

    const categories = ["Coding", "Writing", "Design", "Marketing", "Chatbots", "Other"];
    const aiTools = ["ChatGPT", "Claude", "Midjourney", "DALL-E", "Gemini", "Stable Diffusion"];

    // Handle Delete
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this prompt?")) return;
        setLoadingId(id);
        try {
            await deletePromptAction(id);
            setPrompts(prev => prev.filter(p => p._id !== id));
            toast.success("Prompt deleted successfully");
        } catch (err) {
            toast.error(err.message || "Failed to delete prompt");
        } finally {
            setLoadingId(null);
        }
    };

    // Open Edit Modal
    const openEditModal = (prompt) => {
        setEditPrompt(prompt);
        setEditTitle(prompt.title);
        setEditDesc(prompt.description);
        setEditContent(prompt.content);
        setEditCategory(prompt.category);
        setEditModel(prompt.aiTool);
        setEditTags(prompt.tags?.join(", ") || "");
        setEditDifficulty(prompt.difficulty);
        setEditVisibility(prompt.visibility);
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmittingEdit(true);
        try {
            const tags = editTags.split(",").map(t => t.trim()).filter(t => t !== "");
            const updatedData = {
                title: editTitle,
                description: editDesc,
                content: editContent,
                category: editCategory,
                aiTool: editModel,
                tags,
                difficulty: editDifficulty,
                visibility: editVisibility
            };
            
            await updatePromptAction(editPrompt._id, updatedData);
            setPrompts(prev => prev.map(p => p._id === editPrompt._id ? { ...p, ...updatedData, status: "pending" } : p));
            toast.success("Prompt updated! Resubmitted for admin approval.");
            setEditPrompt(null);
        } catch (err) {
            toast.error(err.message || "Failed to update prompt");
        } finally {
            setSubmittingEdit(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === "approved") {
            return (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={12} />
                    Approved
                </span>
            );
        }
        if (status === "rejected") {
            return (
                <span className="inline-flex items-center gap-1 rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                    <XCircle size={12} />
                    Rejected
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-xs font-semibold text-zinc-400">
                <AlertCircle size={12} />
                Pending
            </span>
        );
    };

    return (
        <div className="bg-zinc-950">
            {prompts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/15">
                    <p className="text-zinc-500 text-sm">You haven&apos;t created any prompts yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/10">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-xs border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">AI Model</th>
                                <th className="px-6 py-4">Visibility</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Copies</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                            {prompts.map((p) => (
                                <tr key={p._id} className="hover:bg-zinc-900/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-white block">{p.title}</span>
                                        {p.feedback && p.status === "rejected" && (
                                            <span className="text-xs text-red-400 block mt-1">Rejection feedback: &ldquo;{p.feedback}&rdquo;</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{p.aiTool}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-0.5 rounded border ${
                                            p.visibility === "Private" 
                                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                        }`}>
                                            {p.visibility}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                                    <td className="px-6 py-4 font-mono">{p.copyCount || 0}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setAnalyticsPrompt(p)}
                                                className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                                title="View Analytics"
                                            >
                                                <BarChart3 size={15} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                disabled={loadingId === p._id}
                                                className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30 bg-zinc-950 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Edit size={18} className="text-indigo-400" />
                            Update Prompt Submission
                        </h3>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Prompt Template</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-sm text-white focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none cursor-pointer"
                                    >
                                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Model</label>
                                    <select
                                        value={editModel}
                                        onChange={(e) => setEditModel(e.target.value)}
                                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none cursor-pointer"
                                    >
                                        {aiTools.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Difficulty</label>
                                    <select
                                        value={editDifficulty}
                                        onChange={(e) => setEditDifficulty(e.target.value)}
                                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none cursor-pointer"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Pro">Pro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Visibility</label>
                                    <select
                                        value={editVisibility}
                                        onChange={(e) => setEditVisibility(e.target.value)}
                                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none cursor-pointer"
                                    >
                                        <option value="Public">Public (Free to view)</option>
                                        <option value="Private">Private (Premium Locked)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Tags</label>
                                <input
                                    type="text"
                                    value={editTags}
                                    onChange={(e) => setEditTags(e.target.value)}
                                    placeholder="react, tailwind"
                                    className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
                                <button
                                    type="button"
                                    onClick={() => setEditPrompt(null)}
                                    className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingEdit}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                                >
                                    {submittingEdit ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Analytics Modal */}
            {analyticsPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart3 size={18} className="text-cyan-400" />
                                Prompt Analytics
                            </h3>
                            <button
                                onClick={() => setAnalyticsPrompt(null)}
                                className="text-zinc-500 hover:text-white cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Prompt Title</span>
                                <span className="text-sm font-semibold text-white">{analyticsPrompt.title}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-y border-zinc-800 py-4 text-center">
                                <div>
                                    <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Copies</span>
                                    <span className="text-lg font-extrabold text-white flex items-center justify-center gap-1 font-mono">
                                        <Copy size={14} className="text-cyan-400" />
                                        {analyticsPrompt.copyCount || 0}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Avg Rating</span>
                                    <span className="text-lg font-extrabold text-white flex items-center justify-center gap-1 font-mono">
                                        <Star size={14} className="fill-amber-500 text-amber-500" />
                                        {analyticsPrompt.rating ? analyticsPrompt.rating.toFixed(1) : "0.0"}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Reviews</span>
                                    <span className="text-lg font-extrabold text-white flex items-center justify-center gap-1 font-mono">
                                        <Check size={14} className="text-emerald-400" />
                                        {analyticsPrompt.reviewCount || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Tier Visibility</span>
                                    <span className="font-semibold text-zinc-300">{analyticsPrompt.visibility}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Target Model</span>
                                    <span className="font-semibold text-zinc-300">{analyticsPrompt.aiTool}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Difficulty Grade</span>
                                    <span className="font-semibold text-zinc-300">{analyticsPrompt.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
