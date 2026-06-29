import { Award, Zap, Users, ShieldCheck } from "lucide-react";

export default function WhyChooseUs() {
    const benefits = [
        {
            icon: <Award className="text-indigo-400" size={24} />,
            title: "Expertly Crafted",
            description: "Every prompt in our marketplace is checked and verified by editors to guarantee quality output and reduce generation failures."
        },
        {
            icon: <Zap className="text-cyan-400" size={24} />,
            title: "Ultra Fast Integration",
            description: "With our copy-to-clipboard feature, you can immediately integrate complex prompts into your developer or content pipeline."
        },
        {
            icon: <Users className="text-purple-400" size={24} />,
            title: "Creator Economy",
            description: "Earn revenue by sharing premium private prompts. Get paid for every user purchase via our simple Stripe checkout system."
        },
        {
            icon: <ShieldCheck className="text-emerald-400" size={24} />,
            title: "Robust Moderation",
            description: "An automated pending status and admin dashboard ensure content guidelines are met, blocking spam and copyright violations."
        }
    ];

    return (
        <section className="bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        Why Choose PromptSphere?
                    </h2>
                    <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
                        Whether you are a developer looking for structured coding scripts or an artist sketching images, we have you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index}
                            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 backdrop-blur-sm transition-all hover:border-zinc-700/80 hover:bg-zinc-900/60"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 mb-6 group-hover:scale-105 transition-transform duration-300">
                                {benefit.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
