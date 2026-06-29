import { getPromptDetails, getReviewsForPrompt, getBookmarkedPrompts } from "@/lib/api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PromptDetailsClient from "@/components/PromptDetailsClient";

export const revalidate = 0; // Disable cache to reflect real-time bookmark and review changes

export default async function PromptDetailsPage({ params }) {
    // Check if user is logged in
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Await params to access id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Fetch Details & Reviews in parallel
    const [prompt, reviews, bookmarks] = await Promise.all([
        getPromptDetails(id),
        getReviewsForPrompt(id),
        getBookmarkedPrompts()
    ]);

    if (!prompt) {
        redirect("/prompts");
    }

    // Determine if this prompt is bookmarked by the user
    const isBookmarked = bookmarks.some(b => b._id === prompt._id);

    return (
        <PromptDetailsClient
            prompt={prompt}
            reviews={reviews}
            isBookmarked={isBookmarked}
            currentUser={session.user}
        />
    );
}
