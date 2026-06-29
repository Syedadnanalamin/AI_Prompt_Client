"use client"

import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
    LineChart, Line, CartesianGrid 
} from "recharts";
import { Terminal, Copy, Bookmark, BarChart3, TrendingUp } from "lucide-react";

export default function CreatorAnalyticsClient({ analyticsData }) {
    const { totalPrompts = 0, totalCopies = 0, totalBookmarks = 0, promptList = [] } = analyticsData;

    // Format data for Recharts
    // Chart 1: Copies per prompt
    const copiesData = promptList.map(p => ({
        name: p.title.length > 15 ? p.title.substring(0, 15) + "..." : p.title,
        Copies: p.copyCount || 0
    }));

    // Chart 2: Cumulative prompt creation timeline (Prompt Growth)
    // Sort prompts by creation date, then calculate running sum
    const sortedPrompts = [...promptList].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    let runningSum = 0;
    const growthData = sortedPrompts.map(p => {
        runningSum += 1;
        return {
            date: new Date(p.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            Prompts: runningSum
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl font-mono text-xs">
                    <p className="text-white font-bold mb-1">{label}</p>
                    <p className="text-indigo-400">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 bg-zinc-950">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Total Prompts */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Prompts</span>
                        <span className="text-3xl font-extrabold text-white font-mono">{totalPrompts}</span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center">
                        <Terminal size={22} />
                    </div>
                </div>

                {/* Total Copies */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Copies</span>
                        <span className="text-3xl font-extrabold text-white font-mono">{totalCopies}</span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center">
                        <Copy size={22} />
                    </div>
                </div>

                {/* Total Bookmarks */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Bookmarks</span>
                        <span className="text-3xl font-extrabold text-white font-mono">{totalBookmarks}</span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25 flex items-center justify-center">
                        <Bookmark size={22} />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Copies per Prompt Chart */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-400" />
                        Prompt Engagement (Copies)
                    </h3>
                    <div className="h-72 w-full text-zinc-400">
                        {copiesData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-sm text-zinc-600">No data available</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={copiesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.15 }} />
                                    <Bar dataKey="Copies" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Prompt Growth Chart */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-cyan-400" />
                        Prompt Count Growth
                    </h3>
                    <div className="h-72 w-full text-zinc-400">
                        {growthData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-sm text-zinc-600">No data available</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="Prompts" stroke="#06b6d4" strokeWidth={2.5} dot={{ stroke: '#06b6d4', strokeWidth: 1.5, r: 3 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
