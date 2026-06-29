"use client"

import { useState } from "react";
import { adminResolveReportAction } from "@/lib/actions";
import { ShieldAlert, Trash2, AlertTriangle, CheckCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminReportsClient({ initialReports = [] }) {
    const [reports, setReports] = useState(initialReports);
    const [loadingId, setLoadingId] = useState(null);

    const handleAction = async (reportId, action, promptId, creatorId) => {
        if (action === "remove" && !confirm("Are you sure you want to remove this prompt? This will delete it completely.")) return;
        if (action === "warn" && !confirm("Warn this creator? This will increment their active warning count on their profile.")) return;

        setLoadingId(reportId);
        try {
            await adminResolveReportAction(reportId, action, promptId, creatorId);
            setReports(prev => prev.filter(r => r._id !== reportId));
            
            if (action === "remove") {
                toast.success("Prompt deleted and report resolved!");
            } else if (action === "warn") {
                toast.success("Warning issued to creator and report resolved!");
            } else {
                toast.success("Report dismissed as harmless!");
            }
        } catch (err) {
            toast.error(err.message || "Failed to resolve report");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-zinc-950">
            {reports.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/15">
                    <p className="text-zinc-500 text-sm">No reported prompts at the moment. Standing is clean!</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/10">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-xs border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Prompt Title</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Reporter</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                            {reports.map((r) => {
                                const promptId = r.promptId;
                                const creatorId = r.promptDetails?.creatorId;
                                return (
                                    <tr key={r._id} className="hover:bg-zinc-900/20 transition-colors">
                                        <td className="px-6 py-4">
                                            {r.promptDetails ? (
                                                <Link 
                                                    href={`/prompts/${promptId}`}
                                                    className="font-bold text-white hover:text-indigo-400 flex items-center gap-1 group transition-colors"
                                                >
                                                    {r.promptDetails.title}
                                                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            ) : (
                                                <span className="text-red-400 font-semibold flex items-center gap-1.5">
                                                    <ShieldAlert size={14} />
                                                    Deleted Prompt
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                                                {r.reason}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 max-w-[200px] truncate" title={r.description}>
                                            {r.description || <span className="text-zinc-600 italic">No description provided</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="block font-medium text-white">{r.name}</span>
                                            <span className="block text-[10px] text-zinc-500 font-mono">{r.email}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Remove prompt */}
                                                <button
                                                    disabled={loadingId === r._id || !r.promptDetails}
                                                    onClick={() => handleAction(r._id, "remove", promptId, creatorId)}
                                                    className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30 bg-zinc-950 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30"
                                                    title="Remove Prompt"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                {/* Warn Creator */}
                                                <button
                                                    disabled={loadingId === r._id || !r.promptDetails}
                                                    onClick={() => handleAction(r._id, "warn", promptId, creatorId)}
                                                    className="p-1.5 rounded-lg border border-zinc-800 hover:border-amber-500/30 bg-zinc-950 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer disabled:opacity-30"
                                                    title="Warn Creator"
                                                >
                                                    <AlertTriangle size={14} />
                                                </button>
                                                {/* Dismiss report */}
                                                <button
                                                    disabled={loadingId === r._id}
                                                    onClick={() => handleAction(r._id, "dismiss")}
                                                    className="p-1.5 rounded-lg border border-zinc-800 hover:border-emerald-500/30 bg-zinc-950 text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
                                                    title="Dismiss / Safe"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
