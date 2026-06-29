import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export const revalidate = 0; // Prevent layouts caching to ensure role-routing stays updated

export default async function DashboardLayout({ children }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <DashboardSidebar user={session.user}>
            {children}
        </DashboardSidebar>
    );
}
