"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export default function Banner() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/prompts?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleTagClick = (tag) => {
        router.push(`/prompts?search=${encodeURIComponent(tag)}`);
    };

    const trendingTags = ["SEO Hack", "ChatGPT 4o", "Claude Coding", "Midjourney Logo", "DALL-E Art", "Copywriting"];

    return (
        <section className="relative overflow-hidden bg-zinc-950 py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="mx-auto max-w-4xl text-center relative z-10">
                {/* Tag Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-6"
                >
                    <Sparkles size={12} />
                    The Ultimate Prompt Marketplace
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
                >
                    Unlock the Full Potential of{" "}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Generative AI
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Discover, copy, and share expert-engineered AI prompts for the world&apos;s leading language and diffusion models. Speed up your workflow today.
                </motion.p>

                {/* Call To Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-10"
                >
                    <Link
                        href="/prompts"
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                    >
                        Browse All Prompts
                    </Link>
                    <Link
                        href="/dashboard/profile"
                        className="px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                        Become a Creator
                    </Link>
                </motion.div>

                {/* Interactive Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-2xl mx-auto mb-8"
                >
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-32 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-base shadow-2xl transition-all"
                            placeholder="Search prompts for writing, coding, images..."
                        />
                        <button
                            type="submit"
                            className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer active:scale-95"
                        >
                            Search
                        </button>
                    </form>
                </motion.div>

                {/* Trending Tags */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-500"
                >
                    <span>Trending Tags:</span>
                    {trendingTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className="rounded-full bg-zinc-900 border border-zinc-800 px-3.5 py-1 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                        >
                            #{tag}
                        </button>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
