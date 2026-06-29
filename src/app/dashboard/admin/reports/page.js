import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminGetReports } from "@/lib/api";
import AdminReportsClient from "@/components/AdminReportsClient";

export const revalidate = 0;

export default async function AdminReportsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "Admin") {
        redirect("/dashboard/profile");
    }

    const reports = await adminGetReports();

    return (
        <div className="space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Reported Flags</h1>
                <p className="text-sm text-zinc-500 mt-1">Review prompts reported by the community, issue warnings, or remove content</p>
            </div>
            <AdminReportsClient initialReports={reports} />
        </div>
    );
}
