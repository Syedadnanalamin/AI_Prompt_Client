"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Terminal, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signIn.email({
                email,
                password,
                callbackURL: "/"
            }, {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    toast.success("Signed in successfully!");
                    router.push("/");
                    router.refresh();
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Invalid credentials");
                    setLoading(false);
                }
            });
        } catch (err) {
            toast.error("An error occurred during login");
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/"
            });
        } catch (err) {
            toast.error("Google sign in failed");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden">
            {/* Background Neons */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 z-10">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg">
                        <Terminal size={24} />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Welcome back! Enter your details to access prompt tools
                    </p>
                </div>

                <div className="mt-8 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
                                    placeholder="sarah@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-2 bg-zinc-900 text-zinc-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-zinc-800 rounded-lg bg-zinc-950 text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.6 15.02 1 12 1 7.28 1 3.25 3.73 1.25 7.73l3.87 3a7.17 7.17 0 0 1 6.88-5.69z" />
                                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.6-.2-2.3H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2 3.49-4.96 3.49-8.68z" />
                                <path fill="#FBBC05" d="M5.12 10.73A7.24 7.24 0 0 1 5.12 8.3L1.25 5.3a11.96 11.96 0 0 0 0 13.4l3.87-3a7.24 7.24 0 0 1 0-4.97z" />
                                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.03.69-2.35 1.1-3.95 1.1-3.1 0-5.74-2.09-6.68-4.92l-3.89 3A11.94 11.94 0 0 0 12 23z" />
                            </svg>
                            Google
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
