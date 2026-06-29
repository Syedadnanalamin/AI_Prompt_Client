"use client"

import { useState } from "react";
import { 
    adminModeratePromptAction, 
    adminToggleFeaturedAction, 
    deletePromptAction 
} from "@/lib/actions";
import { 
    Check, X, Trash2, Sparkles, Terminal, CheckCircle2, 
    XCircle, AlertCircle, Bookmark, Star, ArrowUpRight 
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPromptsClient({ initialPrompts = [] }) {
    const [prompts, setPrompts] = useState(initialPrompts);
    const [loadingId, setLoadingId] = useState(null);

    // Rejection Modal State
    const [rejectPromptId, setRejectPromptId] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [submittingReject, setSubmittingReject] = useState(false);

    // Handle Approve
    const handleApprove = async (id) => {
        setLoadingId(id);
        try {
            await adminModeratePromptAction(id, "approved");
            setPrompts(prev => prev.map(p => p._id === id ? { ...p, status: "approved", feedback: "" } : p));
            toast.success("Prompt approved successfully");
        } catch (err) {
            toast.error(err.message || "Failed to approve prompt");
        } finally {
            setLoadingId(null);
        }
    };

    // Open Rejection Dialog
    const openRejectModal = (id) => {
        setRejectPromptId(id);
        setFeedback("");
    };

    // Handle Reject Submit
    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) {
            toast.error("Please provide rejection feedback");
            return;
        }

        setSubmittingReject(true);
        try {
            await adminModeratePromptAction(rejectPromptId, "rejected", feedback);
            setPrompts(prev => prev.map(p => p._id === rejectPromptId ? { ...p, status: "rejected", feedback } : p));
            toast.success("Prompt rejected with feedback");
            setRejectPromptId(null);
        } catch (err) {
            toast.error(err.message || "Failed to reject prompt");
        } finally {
            setSubmittingReject(false);
        }
    };

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

    // Handle Feature Toggle
    const handleFeatureToggle = async (id, currentFeatured) => {
        const nextState = !currentFeatured;
        setLoadingId(id);
        try {
            await adminToggleFeaturedAction(id, nextState);
            setPrompts(prev => prev.map(p => p._id === id ? { ...p, isFeatured: nextState } : p));
            toast.success(nextState ? "Prompt set as featured" : "Prompt removed from featured");
        } catch (err) {
            toast.error(err.message || "Failed to update featured status");
        } finally {
            setLoadingId(null);
        }
    };

    const getStatusColor = (status) => {
        if (status === "approved") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        if (status === "rejected") return "bg-red-500/10 text-red-400 border-red-500/20";
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    };

    return (
        <div className="bg-zinc-950">
            {prompts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/15">
                    <p className="text-zinc-500 text-sm">No prompts submitted yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/10">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-xs border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Creator</th>
                                <th className="px-6 py-4">Model</th>
                                <th className="px-6 py-4">Tier</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Featured</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                            {prompts.map((p) => (
                                <tr key={p._id} className="hover:bg-zinc-900/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-white block">{p.title}</span>
                                        {p.feedback && p.status === "rejected" && (
                                            <span className="text-xs text-red-400 block mt-1">Feedback: &ldquo;{p.feedback}&rdquo;</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="block font-medium text-white">{p.creatorName}</span>
                                        <span className="block text-[10px] text-zinc-500 font-mono">{p.creatorEmail}</span>
                                    </td>
                                    <td className="px-6 py-4">{p.aiTool}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                                            p.visibility === "Private" 
                                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold" 
                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                        }`}>
                                            {p.visibility}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-semibold uppercase ${getStatusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            disabled={loadingId === p._id || p.status !== "approved"}
                                            onClick={() => handleFeatureToggle(p._id, p.isFeatured)}
                                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-30 ${
                                                p.isFeatured
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/35"
                                                    : "bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700 hover:text-white"
                                            }`}
                                            title={p.isFeatured ? "Unfeature Prompt" : "Feature Prompt"}
                                        >
                                            <Sparkles size={14} className={p.isFeatured ? "fill-amber-400" : ""} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {p.status !== "approved" && (
                                                <button
                                                    disabled={loadingId === p._id}
                                                    onClick={() => handleApprove(p._id)}
                                                    className="p-1.5 rounded-lg border border-zinc-800 hover:border-emerald-500/30 bg-zinc-950 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                                                    title="Approve"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            {p.status !== "rejected" && (
                                                <button
                                                    disabled={loadingId === p._id}
                                                    onClick={() => openRejectModal(p._id)}
                                                    className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30 bg-zinc-950 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                                                    title="Reject"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                            <button
                                                disabled={loadingId === p._id}
                                                onClick={() => handleDelete(p._id)}
                                                className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30 bg-zinc-950 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rejection Feedback Dialog */}
            {rejectPromptId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                        <h3 className="text-lg font-bold text-white mb-2">Rejection Feedback</h3>
                        <p className="text-xs text-zinc-400 mb-6">
                            Provide comments or feedback explaining why this prompt was rejected. The creator will see this message.
                        </p>

                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Rejection Reason</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="e.g. Prompt template has typos, does not meet model guidelines, or lacks details..."
                                    className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
                                <button
                                    type="button"
                                    onClick={() => setRejectPromptId(null)}
                                    className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingReject}
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                                >
                                    {submittingReject ? "Submitting..." : "Reject Submission"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
