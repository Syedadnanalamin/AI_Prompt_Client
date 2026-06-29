"use server"

import { cookies, headers } from "next/headers";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8080";

// Helper to get authenticated headers
async function getAuthHeaders() {
    const cookieStore = await cookies();
    let token = cookieStore.get("better-auth.session_token")?.value;
    if (token && token.includes(".")) {
        token = token.split(".")[0];
    }
    const h = {
        "Content-Type": "application/json",
    };
    if (token) {
        h["Authorization"] = `Bearer ${token}`;
    }
    return h;
}

// Helper to check user session
async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user || null;
}

// 1. Create Prompt
export async function createPromptAction(promptData) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/prompts`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(promptData)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to create prompt");
    }

    revalidatePath("/");
    revalidatePath("/prompts");
    revalidatePath("/dashboard/my-prompts");
    return data;
}

// 2. Update Prompt
export async function updatePromptAction(id, promptData) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/prompts/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(promptData)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update prompt");
    }

    revalidatePath("/prompts");
    revalidatePath(`/prompts/${id}`);
    revalidatePath("/dashboard/my-prompts");
    return data;
}

// 3. Delete Prompt
export async function deletePromptAction(id) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/prompts/${id}`, {
        method: "DELETE",
        headers: authHeaders
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to delete prompt");
    }

    revalidatePath("/prompts");
    revalidatePath("/dashboard/my-prompts");
    return data;
}

// 4. Toggle Bookmark
export async function toggleBookmarkAction(promptId) {
    const user = await getSessionUser();
    if (!user) throw new Error("Please log in to bookmark prompts");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/bookmarks/toggle`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ promptId })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to toggle bookmark");
    }

    revalidatePath(`/prompts/${promptId}`);
    revalidatePath("/dashboard/saved");
    return data;
}

// 5. Add Review
export async function addReviewAction(promptId, rating, comment) {
    const user = await getSessionUser();
    if (!user) throw new Error("Please log in to leave a review");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ promptId, rating, comment })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
    }

    revalidatePath(`/prompts/${promptId}`);
    revalidatePath("/dashboard/reviews");
    return data;
}

// 6. Report Prompt
export async function reportPromptAction(promptId, reason, description) {
    const user = await getSessionUser();
    if (!user) throw new Error("Please log in to report a prompt");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/reports`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ promptId, reason, description })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to submit report");
    }

    return data;
}

// 7. Increment Copy Count
export async function incrementCopyCountAction(promptId) {
    const user = await getSessionUser();
    if (!user) throw new Error("Please log in to copy prompts");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/prompts/copy/${promptId}`, {
        method: "POST",
        headers: authHeaders
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update copy count");
    }

    revalidatePath(`/prompts/${promptId}`);
    return data;
}

// 8. Confirm Payment Checkout
export async function confirmPaymentAction(sessionId) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/payments/confirm`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ sessionId })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to confirm payment");
    }

    revalidatePath("/dashboard/profile");
    return data;
}

// ================= ADMIN SERVER ACTIONS =================

// A1. Change Role
export async function adminChangeRoleAction(userId, role) {
    const user = await getSessionUser();
    if (!user || user.role !== "Admin") throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ role })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to change user role");
    }

    revalidatePath("/dashboard/admin/users");
    return data;
}

// A2. Delete User
export async function adminDeleteUserAction(userId) {
    const user = await getSessionUser();
    if (!user || user.role !== "Admin") throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: authHeaders
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
    }

    revalidatePath("/dashboard/admin/users");
    return data;
}

// A3. Moderation (Approve/Reject)
export async function adminModeratePromptAction(promptId, status, feedback = "") {
    const user = await getSessionUser();
    if (!user || user.role !== "Admin") throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/admin/prompts/${promptId}/status`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ status, feedback })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update prompt status");
    }

    revalidatePath("/");
    revalidatePath("/prompts");
    revalidatePath("/dashboard/admin/prompts");
    return data;
}

// A4. Toggle Featured Status
export async function adminToggleFeaturedAction(promptId, isFeatured) {
    const user = await getSessionUser();
    if (!user || user.role !== "Admin") throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/admin/prompts/${promptId}/feature`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ isFeatured })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update featured status");
    }

    revalidatePath("/");
    revalidatePath("/prompts");
    revalidatePath("/dashboard/admin/prompts");
    return data;
}

// A5. Resolve Report
export async function adminResolveReportAction(reportId, action, promptId, creatorId) {
    const user = await getSessionUser();
    if (!user || user.role !== "Admin") throw new Error("Unauthorized");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/admin/reports/${reportId}/action`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ action, promptId, creatorId })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to resolve report");
    }

    revalidatePath("/dashboard/admin/reports");
    revalidatePath("/prompts");
    return data;
}

// 12. Create Stripe Checkout Session
export async function createCheckoutSessionAction() {
    const user = await getSessionUser();
    if (!user) throw new Error("Please log in to upgrade");

    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/payments/checkout`, {
        method: "POST",
        headers: authHeaders
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to create checkout session");
    }
    return data;
}
