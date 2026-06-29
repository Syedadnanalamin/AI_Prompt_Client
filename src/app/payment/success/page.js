"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPaymentAction } from "@/lib/actions";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!sessionId) {
            toast.error("No session ID found. Redirecting to payment...");
            router.push("/payment");
            return;
        }

        const verifyCheckout = async () => {
            try {
                await confirmPaymentAction(sessionId);
                setSuccess(true);
                toast.success("Payment verified! Account upgraded.");
                
                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    router.push("/dashboard/profile");
                    router.refresh();
                }, 3000);
            } catch (err) {
                toast.error(err.message || "Failed to verify transaction");
                setSuccess(false);
            } finally {
                setVerifying(false);
            }
        };

        verifyCheckout();
    }, [sessionId, router]);

    return (
        <div className="flex-grow bg-zinc-950 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                {verifying ? (
                    <div className="space-y-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto" />
                        <h2 className="text-2xl font-bold text-white">Verifying payment...</h2>
                        <p className="text-zinc-500 text-sm">Please wait while we confirm your Stripe checkout transaction.</p>
                    </div>
                ) : success ? (
                    <div className="space-y-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Payment Complete!</h2>
                            <p className="mt-2 text-sm text-zinc-400">
                                Thank you for your support. Your account has been upgraded to Premium for lifetime.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
                            Redirecting to your dashboard profile in a few seconds...
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/profile")}
                            className="w-full flex justify-center items-center gap-1.5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                        >
                            Go to Dashboard Profile
                            <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                            <CheckCircle2 size={32} className="rotate-180" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
                            <p className="mt-2 text-sm text-zinc-400">
                                We could not verify your payment session. Please check your banking logs or retry.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/payment")}
                            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                        >
                            Retry Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
