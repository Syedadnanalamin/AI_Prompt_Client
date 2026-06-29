"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function PromptsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local states initialized from URL params
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [aiTool, setAiTool] = useState(searchParams.get("aiTool") || "");
    const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "Latest");

    const categories = ["Coding", "Writing", "Design", "Marketing", "Chatbots", "Other"];
    const aiTools = ["ChatGPT", "Claude", "Midjourney", "DALL-E", "Gemini", "Stable Diffusion"];
    const difficulties = ["Beginner", "Intermediate", "Pro"];
    const sortOptions = ["Latest", "Most Popular", "Most Copied"];

    const handleApplyFilters = (updates = {}) => {
        const params = new URLSearchParams(searchParams.toString());
        // Default to page 1 for any filter changes
        params.set("page", "1");

        const newFilters = { search, category, aiTool, difficulty, sort, ...updates };

        Object.entries(newFilters).forEach(([key, val]) => {
            if (val) {
                params.set(key, val);
            } else {
                params.delete(key);
            }
        });

        router.push(`/prompts?${params.toString()}`);
    };

    const handleReset = () => {
        setSearch("");
        setCategory("");
        setAiTool("");
        setDifficulty("");
        setSort("Latest");
        router.push("/prompts");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleApplyFilters();
    };

    return (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 mb-8 backdrop-blur-sm space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search prompts by title, keywords, tags..."
                        className="block w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                    Search
                </button>
            </form>

            {/* Filter selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {/* Category */}
                <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            handleApplyFilters({ category: e.target.value });
                        }}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* AI Tool */}
                <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">AI Tool</label>
                    <select
                        value={aiTool}
                        onChange={(e) => {
                            setAiTool(e.target.value);
                            handleApplyFilters({ aiTool: e.target.value });
                        }}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="">All Tools</option>
                        {aiTools.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => {
                            setDifficulty(e.target.value);
                            handleApplyFilters({ difficulty: e.target.value });
                        }}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="">All Difficulties</option>
                        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sort By</label>
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            handleApplyFilters({ sort: e.target.value });
                        }}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                        {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>

                {/* Reset button */}
                <div className="flex items-end">
                    <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                        <RotateCcw size={14} />
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
