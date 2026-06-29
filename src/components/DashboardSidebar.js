"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    User, PlusCircle, Terminal, Bookmark, MessageSquare, 
    BarChart3, Users, CheckSquare, ShieldCheck, Flag, CreditCard,
    Menu, X, Sparkles
} from "lucide-react";

export default function DashboardSidebar({ user, children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { name: "My Profile", href: "/dashboard/profile", icon: <User size={16} />, roles: ["User", "Creator", "Admin"] },
        { name: "Add Prompt", href: "/dashboard/add-prompt", icon: <PlusCircle size={16} />, roles: ["User", "Creator", "Admin"] },
        { name: "My Prompts", href: "/dashboard/my-prompts", icon: <Terminal size={16} />, roles: ["User", "Creator", "Admin"] },
        { name: "Saved Prompts", href: "/dashboard/saved", icon: <Bookmark size={16} />, roles: ["User", "Creator", "Admin"] },
        { name: "My Reviews", href: "/dashboard/reviews", icon: <MessageSquare size={16} />, roles: ["User", "Creator", "Admin"] },
        
        // Creator Section
        { name: "Creator Analytics", href: "/dashboard/creator", icon: <BarChart3 size={16} />, roles: ["Creator", "Admin"], header: "Creator Space" },
        
        // Admin Section
        { name: "Users Management", href: "/dashboard/admin/users", icon: <Users size={16} />, roles: ["Admin"], header: "Admin Control" },
        { name: "Prompts Moderation", href: "/dashboard/admin/prompts", icon: <CheckSquare size={16} />, roles: ["Admin"] },
        { name: "Payment Transactions", href: "/dashboard/admin/payments", icon: <CreditCard size={16} />, roles: ["Admin"] },
        { name: "Reported Flags", href: "/dashboard/admin/reports", icon: <Flag size={16} />, roles: ["Admin"] },
    ];

    const allowedItems = menuItems.filter(item => item.roles.includes(user.role));

    const isActive = (href) => pathname === href;

    const sidebarContent = () => (
        <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-900 w-64 p-6 select-none justify-between">
            <div className="space-y-6">
                {/* User Card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-800 relative bg-zinc-900 shrink-0">
                        <img
                            src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "U")}`}
                            alt="Avatar"
                            className="object-cover h-full w-full"
                        />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-sm font-bold text-white truncate leading-none mb-1">{user.name}</span>
                        <div className="flex gap-1.5 items-center">
                            <span className="inline-flex rounded-full bg-indigo-600/10 text-[9px] font-extrabold text-indigo-400 border border-indigo-500/25 px-2 py-0.5 uppercase">
                                {user.role}
                            </span>
                            {user.subscription === "Premium" && (
                                <span className="inline-flex rounded-full bg-amber-500/10 text-[9px] font-extrabold text-amber-400 border border-amber-500/25 px-2 py-0.5 uppercase gap-0.5">
                                    <Sparkles size={8} className="mt-0.5" />
                                    PRO
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nav list */}
                <nav className="space-y-1.5">
                    {allowedItems.map((item, idx) => {
                        const showHeader = item.header;
                        return (
                            <div key={idx}>
                                {showHeader && (
                                    <div className="text-[10px] font-extrabold text-zinc-600 uppercase tracking-widest px-3 py-2 mt-4 mb-1">
                                        {item.header}
                                    </div>
                                )}
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                        isActive(item.href)
                                            ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-md"
                                            : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white border border-transparent"
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom back button */}
            <div className="pt-6 border-t border-zinc-900">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 text-zinc-400 hover:text-white text-xs font-semibold hover:border-zinc-700 transition-colors"
                >
                    Back to Marketplace
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row flex-grow min-h-screen bg-zinc-950 text-zinc-100">
            {/* Desktop Sidebar (Left side, persistent) */}
            <aside className="hidden md:block shrink-0">
                {sidebarContent()}
            </aside>

            {/* Mobile Sidebar Trigger (Top bar) */}
            <div className="md:hidden flex items-center justify-between px-6 py-3 border-b border-zinc-900 bg-zinc-950">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-indigo-400 font-mono uppercase tracking-wider">Workspace</span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Slide-out Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <aside className="relative z-50 flex flex-col w-64 h-full animate-slide-in">
                        {sidebarContent()}
                    </aside>
                </div>
            )}

            {/* Dashboard Content area */}
            <main className="flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-10">
                {children}
            </main>
        </div>
    );
}
