"use client"

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="flex-grow bg-zinc-950 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <XCircle size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Payment Cancelled</h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        You cancelled the checkout session. No charges were made to your account.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/payment")}
                    className="w-full flex justify-center items-center gap-1.5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Upgrade Details
                </button>
            </div>
        </div>
    );
}
