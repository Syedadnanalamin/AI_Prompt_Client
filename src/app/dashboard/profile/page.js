import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMyPrompts, getBookmarkedPrompts, getUserReviews } from "@/lib/api";
import Link from "next/link";
import { Sparkles, Terminal, Mail, UserCheck, AlertTriangle, ShieldCheck, Bookmark, MessageSquare, Check } from "lucide-react";

export const revalidate = 0;

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const myPrompts = await getMyPrompts();
    const savedPrompts = await getBookmarkedPrompts();
    const userReviews = await getUserReviews();

    const totalPrompts = myPrompts.length;
    const savedCount = savedPrompts.length;
    const reviewsCount = userReviews.length;

    return (
        <div className="max-w-3xl space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">My Profile</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage your account settings and credentials</p>
            </div>

            {/* Profile Info Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-sm space-y-8">
                {/* Upper Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-800">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-900">
                        <img
                            src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.user.name || "U")}`}
                            alt="Profile Avatar"
                            className="object-cover h-full w-full"
                        />
                    </div>
                    <div className="text-center sm:text-left min-w-0 space-y-1.5">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                            {session.user.name}
                            {session.user.subscription === "Premium" && (
                                <span className="inline-flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400 p-0.5 border border-amber-500/35" title="Verified Premium Member">
                                    <Check size={10} className="stroke-[3]" />
                                </span>
                            )}
                        </h2>
                        <p className="text-sm text-zinc-500 flex items-center justify-center sm:justify-start gap-1">
                            <Mail size={14} />
                            {session.user.email}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1.5 items-center justify-center sm:justify-start">
                            <span className="inline-flex rounded-md bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 uppercase">
                                {session.user.role}
                            </span>
                            <span className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
                                session.user.subscription === "Premium"
                                    ? "bg-amber-500/10 border border-amber-500/25 text-amber-400"
                                    : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                            }`}>
                                {session.user.subscription}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Account Role</span>
                            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                                <UserCheck size={16} className="text-zinc-500" />
                                {session.user.role}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Prompts Submitted</span>
                            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                                <Terminal size={16} className="text-zinc-500" />
                                {totalPrompts} prompts
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Warning Flags</span>
                            {session.user.warnings ? (
                                <span className="text-red-400 font-semibold flex items-center gap-1.5">
                                    <AlertTriangle size={16} className="text-red-400" />
                                    {session.user.warnings} active warnings
                                </span>
                            ) : (
                                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                                    <ShieldCheck size={16} className="text-emerald-400" />
                                    None (Excellent Standing)
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Subscription Tier</span>
                            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                                <Sparkles size={16} className="text-zinc-500" />
                                {session.user.subscription === "Premium" ? "Premium Lifepass" : "Free Plan"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Upgrade Portal Callout */}
                {session.user.subscription !== "Premium" && (
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/25 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="space-y-1 text-center sm:text-left">
                            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1">
                                <Sparkles size={14} className="text-amber-400" />
                                Unlock Sandbox Pro
                            </h4>
                            <p className="text-xs text-zinc-400">
                                Upgrade to upload unlimited prompts and access all private/premium templates for just $5.
                            </p>
                        </div>
                        <Link
                            href="/payment"
                            className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 px-6 py-2.5 text-xs font-extrabold text-zinc-950 shadow-md transition-colors cursor-pointer w-full sm:w-auto text-center shrink-0"
                        >
                            Upgrade to Premium
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Bookmarks */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm flex flex-col justify-between gap-4 hover:border-zinc-700 transition-colors">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Bookmark size={18} className="text-indigo-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Bookmarks</span>
                        </div>
                        <span className="text-3xl font-extrabold text-white font-mono block pt-1">{savedCount}</span>
                        <p className="text-xs text-zinc-500">Saved marketplace templates.</p>
                    </div>
                    <Link
                        href="/dashboard/saved"
                        className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors mt-2"
                    >
                        View Saved Bookmarks →
                    </Link>
                </div>

                {/* My Prompts */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm flex flex-col justify-between gap-4 hover:border-zinc-700 transition-colors">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Terminal size={18} className="text-cyan-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">My Prompts</span>
                        </div>
                        <span className="text-3xl font-extrabold text-white font-mono block pt-1">{totalPrompts}</span>
                        <p className="text-xs text-zinc-500">Templates you have created.</p>
                    </div>
                    <Link
                        href="/dashboard/my-prompts"
                        className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors mt-2"
                    >
                        Manage My Prompts →
                    </Link>
                </div>

                {/* Reviews */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm flex flex-col justify-between gap-4 hover:border-zinc-700 transition-colors">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <MessageSquare size={18} className="text-purple-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Reviews</span>
                        </div>
                        <span className="text-3xl font-extrabold text-white font-mono block pt-1">{reviewsCount}</span>
                        <p className="text-xs text-zinc-500">Feedback you have shared.</p>
                    </div>
                    <Link
                        href="/dashboard/reviews"
                        className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors mt-2"
                    >
                        View My Reviews →
                    </Link>
                </div>
            </div>
        </div>
    );
}
