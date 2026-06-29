"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleBookmarkAction } from "@/lib/actions";
import { Bookmark, Eye, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function SavedPromptsClient({ initialPrompts = [] }) {
    const [prompts, setPrompts] = useState(initialPrompts);
    const router = useRouter();

    const handleRemoveBookmark = async (id) => {
        try {
            await toggleBookmarkAction(id);
            setPrompts(prev => prev.filter(p => p._id !== id));
            toast.success("Bookmark removed");
        } catch (err) {
            toast.error(err.message || "Failed to remove bookmark");
        }
    };

    return (
        <div className="bg-zinc-950">
            {prompts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/15">
                    <ShieldAlert className="mx-auto text-zinc-600 mb-3" size={32} />
                    <p className="text-zinc-500 text-sm">You haven&apos;t bookmarked any prompts yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.map((prompt) => (
                        <div
                            key={prompt._id}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-zinc-700/80 hover:bg-zinc-900/80"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-300 uppercase">
                                        {prompt.aiTool}
                                    </span>
                                    {prompt.visibility === "Private" && (
                                        <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                                            PREMIUM
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                    {prompt.title}
                                </h3>
                                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-6">
                                    {prompt.description}
                                </p>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-zinc-800/80">
                                <button
                                    onClick={() => router.push(`/prompts/${prompt._id}`)}
                                    className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 py-2 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                                >
                                    <Eye size={13} />
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleRemoveBookmark(prompt._id)}
                                    className="px-3 py-2 rounded-lg border border-zinc-800 hover:border-red-500/30 bg-zinc-950 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                    title="Remove Bookmark"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
