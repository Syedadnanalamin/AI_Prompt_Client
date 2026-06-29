import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMyPrompts } from "@/lib/api";
import MyPromptsClient from "@/components/MyPromptsClient";

export const revalidate = 0;

export default async function MyPromptsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const myPrompts = await getMyPrompts();

    return (
        <div className="space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">My Prompts</h1>
                <p className="text-sm text-zinc-500 mt-1">Review the status of your prompt submissions, edit templates, or analyze access metrics</p>
            </div>
            <MyPromptsClient initialPrompts={myPrompts} />
        </div>
    );
}
