import Link from "next/link";
import { PenTool, Code, Palette, Megaphone, Bot, HelpCircle } from "lucide-react";

export default function PromptCategories() {
    const categories = [
        {
            name: "Coding",
            icon: <Code className="text-blue-400" size={24} />,
            color: "group-hover:border-blue-500/30 group-hover:bg-blue-500/5",
            href: "/prompts?category=Coding"
        },
        {
            name: "Writing",
            icon: <PenTool className="text-amber-400" size={24} />,
            color: "group-hover:border-amber-500/30 group-hover:bg-amber-500/5",
            href: "/prompts?category=Writing"
        },
        {
            name: "Design",
            icon: <Palette className="text-purple-400" size={24} />,
            color: "group-hover:border-purple-500/30 group-hover:bg-purple-500/5",
            href: "/prompts?category=Design"
        },
        {
            name: "Marketing",
            icon: <Megaphone className="text-rose-400" size={24} />,
            color: "group-hover:border-rose-500/30 group-hover:bg-rose-500/5",
            href: "/prompts?category=Marketing"
        },
        {
            name: "Chatbots",
            icon: <Bot className="text-emerald-400" size={24} />,
            color: "group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5",
            href: "/prompts?category=Chatbots"
        },
        {
            name: "Other",
            icon: <HelpCircle className="text-zinc-400" size={24} />,
            color: "group-hover:border-zinc-500/30 group-hover:bg-zinc-500/5",
            href: "/prompts?category=Other"
        }
    ];

    return (
        <section className="bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        Browse by Category
                    </h2>
                    <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
                        Find optimized templates across major domains to direct your favorite AI models with high precision.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, index) => (
                        <Link
                            key={index}
                            href={cat.href}
                            className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 text-center hover:shadow-lg transition-all duration-300"
                        >
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 transition-all duration-300 ${cat.color}`}>
                                {cat.icon}
                            </div>
                            <span className="font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
