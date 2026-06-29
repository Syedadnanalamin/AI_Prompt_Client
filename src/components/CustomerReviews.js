"use client"

import { motion } from "framer-motion";
import { Star, MessageSquareQuote } from "lucide-react";
import Image from "next/image";

export default function CustomerReviews() {
    const reviews = [
        {
            id: 1,
            name: "Alex Rivera",
            role: "Senior Full Stack Dev",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
            rating: 5,
            comment: "The coding prompts here are absolute gold. I saved over 6 hours trying to orchestrate complex LangChain and agent structures. The ratings system is super helpful to filter out junk."
        },
        {
            id: 2,
            name: "Emily Chen",
            role: "Creative Director",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
            rating: 5,
            comment: "Midjourney prompts on this platform are mind-blowing! I managed to build a consistent branding kit for our startup in under a day. The copy counter shows exactly which prompts are trending."
        },
        {
            id: 3,
            name: "David K.",
            role: "Copywriter & SEO Expert",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
            rating: 4,
            comment: "Simple copy-paste interface that works perfectly. I upgraded to Premium for the $5 one-time charge, and it was worth every penny. Accessing the private prompts unlocked super advanced SEO copywriting blueprints."
        }
    ];

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}
            />
        ));
    };

    return (
        <section className="bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 overflow-hidden">
            <div className="mx-auto max-w-7xl relative">
                {/* Background Neons */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        Loved by Builders & Creators
                    </h2>
                    <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
                        See how developers, digital marketers, and designers use our curated prompts to build at lightspeed.
                    </p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-8 backdrop-blur-sm transition-all hover:border-zinc-700/80 hover:bg-zinc-900/40"
                        >
                            <MessageSquareQuote className="absolute top-6 right-6 text-zinc-800" size={32} />
                            
                            <div>
                                <div className="flex gap-1 mb-4">
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                                    &ldquo;{review.comment}&rdquo;
                                </p>
                            </div>

                            <div className="flex items-center gap-3 border-t border-zinc-800/85 pt-4">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-zinc-800">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white leading-none mb-1">
                                        {review.name}
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
