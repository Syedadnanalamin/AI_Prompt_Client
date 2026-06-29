import Link from "next/link";
import { Terminal, MessageSquare } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-zinc-400 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
                                <Terminal size={16} />
                            </div>
                            <span className="tracking-tight">
                                Prompt<span className="font-extrabold text-indigo-400">Sphere</span>
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-500">
                            Discover, create, and monetize high-performance AI prompts for ChatGPT, Midjourney, Claude, and more.
                        </p>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/prompts" className="hover:text-white transition-colors">All Prompts</Link>
                            </li>
                            <li>
                                <Link href="/prompts?category=Writing" className="hover:text-white transition-colors">Writing Prompts</Link>
                            </li>
                            <li>
                                <Link href="/prompts?category=Coding" className="hover:text-white transition-colors">Coding Prompts</Link>
                            </li>
                            <li>
                                <Link href="/prompts?category=Design" className="hover:text-white transition-colors">Design & Art</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                            </li>
                            <li>
                                <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
                            </li>
                            <li>
                                <Link href="/payment" className="hover:text-white transition-colors">Go Premium</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Socials & Contacts */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Community</h4>
                        <div className="flex gap-4">
                            {/* X logo (custom render or SVG instead of old Twitter logo) */}
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-zinc-400" aria-label="X">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-zinc-400" aria-label="Github">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-zinc-400" aria-label="LinkedIn">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-600 gap-4">
                    <p>&copy; {new Date().getFullYear()} PromptSphere. All rights reserved.</p>
                    <p>Designed for AI Innovators and prompt engineers.</p>
                </div>
            </div>
        </footer>
    );
}
