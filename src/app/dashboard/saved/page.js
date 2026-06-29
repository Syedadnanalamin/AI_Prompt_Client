import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBookmarkedPrompts } from "@/lib/api";
import SavedPromptsClient from "@/components/SavedPromptsClient";

export const revalidate = 0;

export default async function SavedPromptsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const savedPrompts = await getBookmarkedPrompts();

    return (
        <div className="space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Saved Bookmarks</h1>
                <p className="text-sm text-zinc-500 mt-1">Access prompt templates that you have bookmarked across the marketplace</p>
            </div>
            <SavedPromptsClient initialPrompts={savedPrompts} />
        </div>
    );
}
