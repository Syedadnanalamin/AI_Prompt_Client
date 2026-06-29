import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserReviews } from "@/lib/api";
import { Star, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function MyReviewsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const reviews = await getUserReviews();

    return (
        <div className="space-y-8 bg-zinc-950 max-w-4xl">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">My Reviews</h1>
                <p className="text-sm text-zinc-500 mt-1">Review feedback you have shared with prompt creators across the platform</p>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/15">
                    <MessageSquare className="mx-auto text-zinc-600 mb-3" size={32} />
                    <p className="text-zinc-500 text-sm">You haven&apos;t written any reviews yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((rev) => (
                        <div 
                            key={rev._id} 
                            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm flex flex-col justify-between gap-4"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <Link 
                                        href={`/prompts/${rev.promptId}`}
                                        className="text-sm font-bold text-white hover:text-indigo-400 flex items-center gap-1 group transition-colors"
                                    >
                                        {rev.promptDetails?.title || "Unknown Prompt"}
                                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-500 block">
                                        Model: {rev.promptDetails?.aiTool || "General"}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                                &ldquo;{rev.comment}&rdquo;
                            </p>

                            <div className="text-[10px] font-mono text-zinc-600 pt-3 border-t border-zinc-900/80">
                                Submitted on {new Date(rev.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
