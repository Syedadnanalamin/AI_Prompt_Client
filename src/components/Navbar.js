"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { Menu, X, Terminal, User, LogOut, LayoutDashboard, Compass } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
        } catch (e) {
            toast.error("Logout failed");
        }
    };

    // Determine dashboard path based on role
    const getDashboardPath = () => {
        if (!session?.user) return "/login";
        if (session.user.role === "Admin") return "/dashboard/admin/analytics";
        if (session.user.role === "Creator") return "/dashboard/creator";
        return "/dashboard/profile";
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "All Prompts", href: "/prompts" },
    ];

    const isActive = (path) => pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo and Name */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg transition-transform group-hover:scale-105">
                            <Terminal size={18} />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-200 via-zinc-100 to-cyan-100 bg-clip-text text-transparent tracking-tight">
                            Prompt<span className="font-extrabold text-indigo-400">Sphere</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-white ${
                                    isActive(link.href) ? "text-indigo-400 font-semibold" : "text-zinc-400"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Session Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {!isPending && (
                        <>
                            {session?.user ? (
                                <>
                                    <Link
                                        href={getDashboardPath()}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                            pathname.startsWith("/dashboard")
                                                ? "bg-indigo-600/25 text-indigo-400 border border-indigo-500/35"
                                                : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white border border-transparent"
                                        }`}
                                    >
                                        <LayoutDashboard size={15} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 rounded-lg border border-zinc-800 hover:border-red-500/40 hover:bg-red-500/10 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
                                    >
                                        <LogOut size={15} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/30 transition-all active:scale-95"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isOpen && (
                <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                                    isActive(link.href) ? "bg-zinc-800/80 text-white font-semibold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
                        {!isPending && (
                            <>
                                {session?.user ? (
                                    <>
                                        <Link
                                            href={getDashboardPath()}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-3 py-2 text-base font-medium text-white transition-colors"
                                        >
                                            <LayoutDashboard size={18} />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                handleSignOut();
                                            }}
                                            className="flex items-center gap-2 w-full text-left rounded-lg bg-red-950/20 text-red-400 hover:bg-red-950/30 px-3 py-2 text-base font-medium transition-colors cursor-pointer"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex justify-center rounded-lg border border-zinc-800 px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-900 transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="flex justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-3 py-2 text-base font-semibold text-white shadow-md transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
