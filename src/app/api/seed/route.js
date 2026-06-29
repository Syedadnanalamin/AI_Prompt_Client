import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const revalidate = 0;

export async function GET() {
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("AIPrompt");

        // 1. Clean collections to prevent duplicates
        await db.collection("prompts").deleteMany({});
        await db.collection("reports").deleteMany({});
        await db.collection("reviews").deleteMany({});
        await db.collection("bookmarks").deleteMany({});
        await db.collection("user").deleteMany({});
        await db.collection("account").deleteMany({});
        await db.collection("session").deleteMany({});

        // 2. Create users using Better Auth server-side API
        // User Account (Sarah User)
        await auth.api.signUpEmail({
            body: {
                email: "user@promptsphere.com",
                password: "password123",
                name: "Sarah User",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
            }
        });
        
        // Creator Account (Syed Creator)
        await auth.api.signUpEmail({
            body: {
                email: "creator@promptsphere.com",
                password: "password123",
                name: "Syed Creator",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
            }
        });

        // Admin Account (Tamal Admin)
        await auth.api.signUpEmail({
            body: {
                email: "admin@promptsphere.com",
                password: "password123",
                name: "Tamal Admin",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120"
            }
        });

        // 3. Update roles and subscriptions in the database
        await db.collection("user").updateOne(
            { email: "creator@promptsphere.com" },
            { $set: { role: "Creator", subscription: "Free" } }
        );

        await db.collection("user").updateOne(
            { email: "admin@promptsphere.com" },
            { $set: { role: "Admin", subscription: "Premium" } }
        );

        // Get creator's user id to link prompt submissions
        const creatorUser = await db.collection("user").findOne({ email: "creator@promptsphere.com" });
        const creatorId = creatorUser.id || creatorUser._id.toString();

        // 4. Seed prompts
        const promptsSeed = [
            {
                title: "React Pricing UI Generator",
                description: "Generates fully functional, accessible, and responsive Pricing UI components in React.",
                content: "Act as a frontend React and Tailwind CSS architect. Generate a responsive Pricing Card component named [cardName] for a subscription plan named [planName] with a price of [price]. Use flexbox and clean grid structures.",
                category: "Coding",
                aiTool: "ChatGPT",
                tags: ["react", "tailwind", "ui", "pricing"],
                difficulty: "Beginner",
                thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=150",
                visibility: "Public",
                copyCount: 124,
                rating: 4.9,
                reviewCount: 2,
                status: "approved",
                isFeatured: true,
                creatorId,
                creatorName: "Syed Creator",
                creatorEmail: "creator@promptsphere.com",
                createdAt: new Date()
            },
            {
                title: "SEO Blog Title Generator",
                description: "Generates high-CTR SEO optimized headlines and descriptions for blog posts.",
                content: "Generate 5 eye-catching, SEO-optimized title variants and descriptions for a blog post discussing [topic] targeting [audience]. Ensure the title contains keywords and is under 60 characters.",
                category: "Writing",
                aiTool: "Claude",
                tags: ["seo", "marketing", "copywriting", "headlines"],
                difficulty: "Intermediate",
                thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=200&h=150",
                visibility: "Public",
                copyCount: 89,
                rating: 4.7,
                reviewCount: 1,
                status: "approved",
                isFeatured: true,
                creatorId,
                creatorName: "Syed Creator",
                creatorEmail: "creator@promptsphere.com",
                createdAt: new Date()
            },
            {
                title: "Midjourney Cinematic Landscape v6",
                description: "Crafts breathtaking, hyper-realistic cinematic fantasy landscapes in Midjourney.",
                content: "cinematic landscape, [location], fantasy, volumetric lighting, hyper-realistic, photorealistic, 8k resolution, octane render, unreal engine 5, --ar 16:9 --v 6.0",
                category: "Design",
                aiTool: "Midjourney",
                tags: ["midjourney", "art", "landscape", "cinematic"],
                difficulty: "Pro",
                thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200&h=150",
                visibility: "Public",
                copyCount: 245,
                rating: 4.8,
                reviewCount: 3,
                status: "approved",
                isFeatured: true,
                creatorId,
                creatorName: "Syed Creator",
                creatorEmail: "creator@promptsphere.com",
                createdAt: new Date()
            },
            {
                title: "Premium Copywriting Pitch Script",
                description: "Lifetime premium prompt that generates high-converting cold email sales copy.",
                content: "Act as an expert copywriter. Write a 3-paragraph cold sales email targeting [clientRole] for [myService]. The email must immediately identify a problem in [clientProblem], propose our service, and call to action with a low-friction hook.",
                category: "Marketing",
                aiTool: "ChatGPT",
                tags: ["copywriting", "sales", "cold email", "pitching"],
                difficulty: "Pro",
                thumbnail: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=200&h=150",
                visibility: "Private",
                copyCount: 62,
                rating: 5.0,
                reviewCount: 1,
                status: "approved",
                isFeatured: true,
                creatorId,
                creatorName: "Syed Creator",
                creatorEmail: "creator@promptsphere.com",
                createdAt: new Date()
            },
            {
                title: "React Hook Form Wizard",
                description: "Generates custom React Hook Form validation hooks with Zod schemas.",
                content: "Act as a TypeScript wizard. Create a custom validation schema using Zod and integrate it with React Hook Form for a signup layout containing [fields]. Provide clean input validation states.",
                category: "Coding",
                aiTool: "Claude",
                tags: ["react", "forms", "zod", "validation"],
                difficulty: "Intermediate",
                thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=200&h=150",
                visibility: "Public",
                copyCount: 178,
                rating: 4.9,
                reviewCount: 2,
                status: "approved",
                isFeatured: true,
                creatorId,
                creatorName: "Syed Creator",
                creatorEmail: "creator@promptsphere.com",
                createdAt: new Date()
            },
            {
                title: "Premium Midjourney Logo Art",
                description: "Premium locked prompt that renders minimalist, vector logo icons.",
                content: "minimalist vector logo of a [subject], clean flat color, vector graphic, dribbble, behance, flat illustration, white background, no gradients --v 6.0",
                category: "Design",
                aiTool: "Midjourney",
                tags: ["logo", "design", "vector", "minimalist"],
                difficulty: "Intermediate",
                thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=200&h=150",
                visibility: "Private",
                copyCount: 42,
                rating: 4.6,
                reviewCount: 1,
                status: "approved",
                isFeatured: true,
                creatorId,
                creatorName: "Syed Creator",
                creatorEmail: "creator@promptsphere.com",
                createdAt: new Date()
            }
        ];

        await db.collection("prompts").insertMany(promptsSeed);

        // 5. Seed reviews
        const cursorPrompts = await db.collection("prompts").find().toArray();
        const reviewsSeed = [];
        for (const prompt of cursorPrompts) {
            reviewsSeed.push({
                promptId: prompt._id.toString(),
                userId: "sample-user-id",
                name: "Jane Analyst",
                email: "jane@test.com",
                rating: 5,
                comment: "Extremely useful template. Runs flawlessly inside ChatGPT.",
                createdAt: new Date()
            });
        }
        await db.collection("reviews").insertMany(reviewsSeed);

        await client.close();
        return NextResponse.json({ success: true, message: "Database successfully seeded with mock prompts, accounts, and users!" });
    } catch (err) {
        console.error("Seeding error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
