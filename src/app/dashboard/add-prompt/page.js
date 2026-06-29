import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMyPrompts } from "@/lib/api";
import AddPromptForm from "@/components/AddPromptForm";

export const revalidate = 0;

export default async function AddPromptPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const myPrompts = await getMyPrompts();
    const totalPrompts = myPrompts.length;

    return (
        <div className="space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Add New Prompt</h1>
                <p className="text-sm text-zinc-500 mt-1">Design a prompt template for the community and define subscription locking options</p>
            </div>
            <AddPromptForm
                totalPrompts={totalPrompts}
                subscription={session.user.subscription}
            />
        </div>
    );
}
