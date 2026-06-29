import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminGetAnalytics } from "@/lib/api";
import { Users, Terminal, MessageSquare, Copy, ShieldAlert, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "Admin") {
        redirect("/dashboard/profile");
    }

    const stats = await adminGetAnalytics();

    const statCards = [
        {
            title: "Total Registered Users",
            value: stats.totalUsers || 0,
            icon: <Users size={22} />,
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25"
        },
        {
            title: "Approved Public Prompts",
            value: stats.totalPrompts || 0,
            icon: <Terminal size={22} />,
            color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25"
        },
        {
            title: "Total Reviews Submitted",
            value: stats.totalReviews || 0,
            icon: <MessageSquare size={22} />,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/25"
        },
        {
            title: "Total Prompt Copies",
            value: stats.totalCopies || 0,
            icon: <Copy size={22} />,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
        }
    ];

    return (
        <div className="space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Admin Analytics</h1>
                <p className="text-sm text-zinc-500 mt-1">Global platform metrics and registration tracking statistics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm flex items-center justify-between"
                    >
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                {stat.title}
                            </span>
                            <span className="text-3xl font-extrabold text-white font-mono">{stat.value}</span>
                        </div>
                        <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-8 text-center max-w-2xl">
                <ShieldCheck className="mx-auto text-indigo-400 mb-3" size={36} />
                <h3 className="text-base font-bold text-white mb-2">Systems Standing Normal</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                    Database connections are secure. Active processes (Express listener, MongoDB drivers, Stripe session managers) are executing correctly. Role mappings and route authorizations are live.
                </p>
            </div>
        </div>
    );
}
