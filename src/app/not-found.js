"use client"

import Link from "next/link";
import { Terminal, MoveLeft } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="flex-grow bg-zinc-950 flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
            {/* Background Neons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
                    <Terminal size={28} />
                </div>
                <div>
                    <h1 className="text-6xl font-extrabold text-white tracking-tight font-mono">404</h1>
                    <h2 className="text-xl font-bold text-zinc-200 mt-3">Page Not Found</h2>
                    <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                        The requested prompt workspace, dashboard path, or transaction log could not be located in PromptSphere.
                    </p>
                </div>
                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
                    >
                        <MoveLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
