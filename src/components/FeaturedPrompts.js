"use client"

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Star, Copy, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function FeaturedPrompts({ initialPrompts = [] }) {
    const { data: session } = useSession();
    const router = useRouter();

    const handleViewDetails = (id) => {
        if (!session?.user) {
            toast.error("Please log in to view prompt details");
            router.push("/login");
        } else {
            router.push(`/prompts/${id}`);
        }
    };

    // Card animation container
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardItem = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    const getDifficultyColor = (diff) => {
        if (diff === "Beginner") return "bg-green-500/10 text-green-400 border-green-500/20";
        if (diff === "Intermediate") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    };

    return (
        <section className="bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                            Featured Prompts
                        </h2>
                        <p className="mt-3 text-zinc-400 max-w-xl">
                            Explore top-rated, tested prompts curated for high accuracy and optimized responses.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/prompts")}
                        className="mt-4 md:mt-0 flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group cursor-pointer"
                    >
                        Browse All Prompts
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {initialPrompts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
                        <ShieldAlert className="mx-auto text-zinc-500 mb-3" size={40} />
                        <p className="text-zinc-400">No featured prompts available at the moment.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {initialPrompts.map((prompt) => (
                            <motion.div
                                key={prompt._id}
                                variants={cardItem}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-zinc-700/80 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-indigo-500/5"
                            >
                                <div>
                                    {/* Badges */}
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 uppercase">
                                                {prompt.aiTool}
                                            </span>
                                            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getDifficultyColor(prompt.difficulty)}`}>
                                                {prompt.difficulty}
                                            </span>
                                        </div>
                                        {prompt.visibility === "Private" && (
                                            <span className="rounded-md bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                                                PREMIUM
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 mb-2 group-hover:text-indigo-400 transition-colors">
                                        {prompt.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-zinc-400 line-clamp-2 mb-6 leading-relaxed">
                                        {prompt.description}
                                    </p>
                                </div>

                                <div className="border-t border-zinc-800/80 pt-4 mt-auto">
                                    {/* Meta Row */}
                                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Copy size={13} />
                                                {prompt.copyCount || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="fill-amber-500 text-amber-500" size={13} />
                                                {prompt.rating ? prompt.rating.toFixed(1) : "0.0"} ({prompt.reviewCount || 0})
                                            </span>
                                        </div>
                                        <span>By {prompt.creatorName || "Anonymous"}</span>
                                    </div>

                                    {/* Action button */}
                                    <button
                                        onClick={() => handleViewDetails(prompt._id)}
                                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 py-2.5 text-sm font-semibold text-white transition-all cursor-pointer active:scale-[0.98]"
                                    >
                                        <Eye size={15} />
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
