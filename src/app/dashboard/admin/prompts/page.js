import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminGetPrompts } from "@/lib/api";
import AdminPromptsClient from "@/components/AdminPromptsClient";

export const revalidate = 0;

export default async function AdminPromptsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "Admin") {
        redirect("/dashboard/profile");
    }

    const prompts = await adminGetPrompts();

    return (
        <div className="space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Prompts Moderation</h1>
                <p className="text-sm text-zinc-500 mt-1">Moderate submitted prompt templates, toggle search featuring, or delete listings</p>
            </div>
            <AdminPromptsClient initialPrompts={prompts} />
        </div>
    );
}
