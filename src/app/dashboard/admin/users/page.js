import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminGetUsers } from "@/lib/api";
import AdminUsersClient from "@/components/AdminUsersClient";

export const revalidate = 0;

export default async function AdminUsersPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "Admin") {
        redirect("/dashboard/profile");
    }

    const users = await adminGetUsers();

    return (
        <div className="space-y-8 bg-zinc-950">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Users Management</h1>
                <p className="text-sm text-zinc-500 mt-1">Review registered user accounts, adjust roles, or delete users</p>
            </div>
            <AdminUsersClient initialUsers={users} currentUser={session.user} />
        </div>
    );
}
