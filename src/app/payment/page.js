"use client"

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Shield, Zap, Infinity, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { createCheckoutSessionAction } from "@/lib/actions";

export default function PaymentPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!session?.user) {
            toast.error("Please sign in to proceed with payment");
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const data = await createCheckoutSessionAction();
            if (data.url) {
                // Redirect user to Stripe Checkout
                window.location.href = data.url;
            } else {
                toast.error("Failed to create checkout session");
                setLoading(false);
            }
        } catch (err) {
            toast.error(err.message || "Failed to connect to the payment gateway");
            setLoading(false);
        }
    };

    const benefits = [
        {
            icon: <Infinity className="text-amber-400" size={18} />,
            text: "Unlimited Prompt Creations (Free users limited to 3)"
        },
        {
            icon: <Lock className="text-amber-400" size={18} />,
            text: "Access all Private & Premium Prompts"
        },
        {
            icon: <Shield className="text-amber-400" size={18} />,
            text: "Full review & copy access on all templates"
        },
        {
            icon: <Zap className="text-amber-400" size={18} />,
            text: "Featured prompt prioritization from admins"
        }
    ];

    if (isPending) {
        return (
            <div className="flex-grow flex items-center justify-center bg-zinc-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="flex-grow bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
            {/* Background Neons */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full space-y-8 z-10">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-zinc-950 shadow-lg">
                        <Sparkles size={24} />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
                        Upgrade to Premium
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Unlock the complete prompt sandbox and monetization toolkit
                    </p>
                </div>

                <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl shadow-2xl relative">
                    {/* Glow tag */}
                    <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-l from-amber-500 to-yellow-500 px-4 py-1 text-[10px] font-extrabold text-zinc-950 uppercase tracking-widest">
                        Best Value
                    </div>

                    <div className="text-center pb-6 border-b border-zinc-800">
                        <h3 className="text-lg font-bold text-white mb-2">Lifetime Access Pass</h3>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-extrabold text-white">$5</span>
                            <span className="text-sm font-semibold text-zinc-500">.00 one-time</span>
                        </div>
                    </div>

                    <ul className="my-8 space-y-4">
                        {benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 mt-0.5">
                                    {b.icon}
                                </div>
                                <span>{b.text}</span>
                            </li>
                        ))}
                    </ul>

                    {session?.user?.subscription === "Premium" ? (
                        <div className="text-center py-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-sm font-semibold">
                            You are already a Premium member!
                        </div>
                    ) : (
                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg text-sm font-extrabold text-zinc-950 bg-gradient-to-r from-amber-500 via-yellow-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Connecting to Stripe..." : "Upgrade to Premium Now"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
