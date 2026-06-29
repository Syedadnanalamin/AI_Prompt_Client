"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPromptAction } from "@/lib/actions";
import { AlertCircle, HelpCircle, Terminal, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function AddPromptForm({ totalPrompts, subscription }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Coding");
    const [aiTool, setAiTool] = useState("ChatGPT");
    const [tagsInput, setTagsInput] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [thumbnail, setThumbnail] = useState("");
    const [visibility, setVisibility] = useState("Public");
    const [instructions, setInstructions] = useState("");
    const [loading, setLoading] = useState(false);

    const categories = ["Coding", "Writing", "Design", "Marketing", "Chatbots", "Other"];
    const aiTools = ["ChatGPT", "Claude", "Midjourney", "DALL-E", "Gemini", "Stable Diffusion"];
    const difficulties = ["Beginner", "Intermediate", "Pro"];

    const isLimitHit = subscription !== "Premium" && totalPrompts >= 3;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLimitHit) {
            toast.error("Free tier limit reached! Please upgrade to Premium.");
            router.push("/payment");
            return;
        }

        if (!title || !description || !content) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Process tags
        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== "");

        const promptData = {
            title,
            description,
            content,
            category,
            aiTool,
            tags,
            difficulty,
            thumbnail: thumbnail || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(title)}`,
            visibility,
            instructions
        };

        setLoading(true);
        try {
            await createPromptAction(promptData);
            toast.success("Prompt submitted successfully and is pending approval!");
            router.push("/dashboard/my-prompts");
            router.refresh();
        } catch (err) {
            toast.error(err.message || "Failed to submit prompt");
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-950">
            {/* Header warn */}
            {isLimitHit ? (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5 mb-8 flex items-start gap-3">
                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Creation Limit Reached</h4>
                        <p className="text-xs text-red-300 leading-relaxed">
                            You have submitted {totalPrompts} prompts. Free users are limited to 3 prompt submissions. Upgrade to Premium to create unlimited prompts!
                        </p>
                    </div>
                </div>
            ) : (
                subscription !== "Premium" && (
                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 mb-8 flex items-start gap-3">
                        <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">Prompt Limit Warning ({totalPrompts}/3)</h4>
                            <p className="text-xs text-amber-300 leading-relaxed">
                                You have submitted {totalPrompts} out of 3 free prompts. Upgrade to Premium for unlimited submissions.
                            </p>
                        </div>
                    </div>
                )
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Prompt Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            disabled={isLimitHit}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Next.js 16 API Route Specialist"
                            className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Short Description */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Short Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={2}
                            disabled={isLimitHit}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief summary explaining what this prompt accomplishes..."
                            className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Prompt Content */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Prompt Content / Template <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={5}
                            disabled={isLimitHit}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Act as a [role]. Complete the following: [task]..."
                            className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                            Use brackets (e.g. [topic] or [componentName]) to let marketplace users understand which variables they need to substitute when testing this prompt.
                        </p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Category
                        </label>
                        <select
                            disabled={isLimitHit}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* AI Tool */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            AI Model / Tool
                        </label>
                        <select
                            disabled={isLimitHit}
                            value={aiTool}
                            onChange={(e) => setAiTool(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                            {aiTools.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Difficulty Level
                        </label>
                        <select
                            disabled={isLimitHit}
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                            {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Visibility / Tier
                        </label>
                        <select
                            disabled={isLimitHit}
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="Public">Public (Free to view)</option>
                            <option value="Private">Private (Premium Locked)</option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Tags (Comma separated)
                        </label>
                        <input
                            type="text"
                            disabled={isLimitHit}
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="react, cards, tailwind"
                            className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Thumbnail URL */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Thumbnail URL (Optional)
                        </label>
                        <input
                            type="url"
                            disabled={isLimitHit}
                            value={thumbnail}
                            onChange={(e) => setThumbnail(e.target.value)}
                            placeholder="https://example.com/thumb.jpg"
                            className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Usage Instructions */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Usage Instructions (Optional)
                        </label>
                        <textarea
                            rows={3}
                            disabled={isLimitHit}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Provide details on how to set model settings (temperature, system instruction) or example queries..."
                            className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                    <button
                        type="submit"
                        disabled={loading || isLimitHit}
                        className="w-full flex items-center justify-center gap-1.5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
                    >
                        <Check size={16} />
                        {loading ? "Submitting..." : "Submit for Moderation Approval"}
                    </button>
                </div>
            </form>
        </div>
    );
}
