import { Award, Copy, Terminal } from "lucide-react";
import Image from "next/image";

export default function TopCreators({ creators = [] }) {
    return (
        <section className="bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        Top Prompt Engineers
                    </h2>
                    <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
                        Meet the community&apos;s leading creators delivering optimized prompts with the highest copy rates.
                    </p>
                </div>

                {creators.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        Top creators are loading or database has no records.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {creators.map((creator, index) => (
                            <div
                                key={creator._id}
                                className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex flex-col items-center text-center backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-300"
                            >
                                {/* Rank Medal */}
                                <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                                    #{index + 1}
                                </div>

                                {/* Avatar */}
                                <div className="relative mb-5 h-20 w-20 rounded-2xl overflow-hidden border-2 border-zinc-800 group-hover:border-indigo-500/50 transition-colors duration-300">
                                    <Image
                                        src={creator.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(creator.creatorName || "U")}`}
                                        alt={creator.creatorName || "Creator"}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Creator Info */}
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                    {creator.creatorName || "Anonymous Creator"}
                                </h3>
                                <p className="text-xs text-zinc-500 mb-6 truncate max-w-full">
                                    {creator.email || "prompt-designer@sphere.com"}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 w-full border-t border-zinc-800/80 pt-4 text-left">
                                    <div>
                                        <span className="block text-[10px] uppercase font-semibold tracking-wider text-zinc-500 mb-1">Prompts</span>
                                        <span className="flex items-center gap-1 text-sm font-bold text-zinc-300">
                                            <Terminal size={14} className="text-indigo-400" />
                                            {creator.totalPrompts || 0}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-semibold tracking-wider text-zinc-500 mb-1">Total Copies</span>
                                        <span className="flex items-center gap-1 text-sm font-bold text-zinc-300">
                                            <Copy size={14} className="text-cyan-400" />
                                            {creator.totalCopies || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
