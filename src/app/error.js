"use client"

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex-grow bg-zinc-950 flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-md bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertCircle size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Something went wrong!</h2>
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                        An error occurred while compiling your layout request. Try executing a reset or contact PromptSphere support.
                    </p>
                </div>
                <div className="flex justify-center gap-3 pt-4 border-t border-zinc-800/80">
                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                        <RotateCcw size={14} />
                        Retry Layout
                    </button>
                    <Link
                        href="/"
                        className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
