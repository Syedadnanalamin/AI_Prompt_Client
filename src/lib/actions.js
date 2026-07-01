"use server"

import { cookies, headers } from "next/headers";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

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

// Helper to handle fetch responses and parse errors safely without crashing Next.js
async function handleResponse(res, fallbackMessage) {
    if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        let errorMessage = fallbackMessage;
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            if (errorText && errorText.length < 150) {
                errorMessage = errorText;
            } else {
                errorMessage = `${fallbackMessage} (Status Code ${res.status})`;
            }
        }
        throw new Error(errorMessage);
    }
    return await res.json().catch(() => ({}));
}

// 1. Create Prompt
export async function createPromptAction(promptData) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Unauthorized: Please log in");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/prompts`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify(promptData)
        });

        const data = await handleResponse(res, "Failed to create prompt");
        revalidatePath("/");
        revalidatePath("/prompts");
        revalidatePath("/dashboard/my-prompts");
        return data;
    } catch (err) {
        console.error("createPromptAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 2. Update Prompt
export async function updatePromptAction(id, promptData) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Unauthorized: Please log in");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/prompts/${id}`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify(promptData)
        });

        const data = await handleResponse(res, "Failed to update prompt");
        revalidatePath("/prompts");
        revalidatePath(`/prompts/${id}`);
        revalidatePath("/dashboard/my-prompts");
        return data;
    } catch (err) {
        console.error("updatePromptAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 3. Delete Prompt
export async function deletePromptAction(id) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Unauthorized: Please log in");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/prompts/${id}`, {
            method: "DELETE",
            headers: authHeaders
        });

        const data = await handleResponse(res, "Failed to delete prompt");
        revalidatePath("/prompts");
        revalidatePath("/dashboard/my-prompts");
        return data;
    } catch (err) {
        console.error("deletePromptAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 4. Toggle Bookmark
export async function toggleBookmarkAction(promptId) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Please log in to bookmark prompts");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/bookmarks/toggle`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ promptId })
        });

        const data = await handleResponse(res, "Failed to toggle bookmark");
        revalidatePath(`/prompts/${promptId}`);
        revalidatePath("/dashboard/saved");
        return data;
    } catch (err) {
        console.error("toggleBookmarkAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 5. Add Review
export async function addReviewAction(promptId, rating, comment) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Please log in to leave a review");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/reviews`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ promptId, rating, comment })
        });

        const data = await handleResponse(res, "Failed to submit review");
        revalidatePath(`/prompts/${promptId}`);
        revalidatePath("/dashboard/reviews");
        return data;
    } catch (err) {
        console.error("addReviewAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 6. Report Prompt
export async function reportPromptAction(promptId, reason, description) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Please log in to report a prompt");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/reports`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ promptId, reason, description })
        });

        return await handleResponse(res, "Failed to submit report");
    } catch (err) {
        console.error("reportPromptAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 7. Increment Copy Count
export async function incrementCopyCountAction(promptId) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Please log in to copy prompts");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/prompts/copy/${promptId}`, {
            method: "POST",
            headers: authHeaders
        });

        const data = await handleResponse(res, "Failed to update copy count");
        revalidatePath(`/prompts/${promptId}`);
        return data;
    } catch (err) {
        console.error("incrementCopyCountAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 8. Confirm Payment Checkout
export async function confirmPaymentAction(sessionId) {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Unauthorized");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/payments/confirm`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ sessionId })
        });

        const data = await handleResponse(res, "Failed to confirm payment");
        revalidatePath("/dashboard/profile");
        return data;
    } catch (err) {
        console.error("confirmPaymentAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// ================= ADMIN SERVER ACTIONS =================

// A1. Change Role
export async function adminChangeRoleAction(userId, role) {
    try {
        const user = await getSessionUser();
        if (!user || user.role !== "Admin") throw new Error("Unauthorized");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ role })
        });

        const data = await handleResponse(res, "Failed to change user role");
        revalidatePath("/dashboard/admin/users");
        return data;
    } catch (err) {
        console.error("adminChangeRoleAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// A2. Delete User
export async function adminDeleteUserAction(userId) {
    try {
        const user = await getSessionUser();
        if (!user || user.role !== "Admin") throw new Error("Unauthorized");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
            method: "DELETE",
            headers: authHeaders
        });

        const data = await handleResponse(res, "Failed to delete user");
        revalidatePath("/dashboard/admin/users");
        return data;
    } catch (err) {
        console.error("adminDeleteUserAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// A3. Moderation (Approve/Reject)
export async function adminModeratePromptAction(promptId, status, feedback = "") {
    try {
        const user = await getSessionUser();
        if (!user || user.role !== "Admin") throw new Error("Unauthorized");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/prompts/${promptId}/status`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ status, feedback })
        });

        const data = await handleResponse(res, "Failed to update prompt status");
        revalidatePath("/");
        revalidatePath("/prompts");
        revalidatePath("/dashboard/admin/prompts");
        return data;
    } catch (err) {
        console.error("adminModeratePromptAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// A4. Toggle Featured Status
export async function adminToggleFeaturedAction(promptId, isFeatured) {
    try {
        const user = await getSessionUser();
        if (!user || user.role !== "Admin") throw new Error("Unauthorized");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/prompts/${promptId}/feature`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ isFeatured })
        });

        const data = await handleResponse(res, "Failed to update featured status");
        revalidatePath("/");
        revalidatePath("/prompts");
        revalidatePath("/dashboard/admin/prompts");
        return data;
    } catch (err) {
        console.error("adminToggleFeaturedAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// A5. Resolve Report
export async function adminResolveReportAction(reportId, action, promptId, creatorId) {
    try {
        const user = await getSessionUser();
        if (!user || user.role !== "Admin") throw new Error("Unauthorized");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/reports/${reportId}/action`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ action, promptId, creatorId })
        });

        const data = await handleResponse(res, "Failed to resolve report");
        revalidatePath("/dashboard/admin/reports");
        revalidatePath("/prompts");
        return data;
    } catch (err) {
        console.error("adminResolveReportAction error:", err);
        throw new Error(err.message || "Connection failure");
    }
}

// 12. Create Stripe Checkout Session
export async function createCheckoutSessionAction() {
    try {
        const user = await getSessionUser();
        if (!user) throw new Error("Please log in to upgrade");

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/payments/checkout`, {
            method: "POST",
            headers: authHeaders
        });

        return await handleResponse(res, "Failed to create checkout session");
    } catch (err) {
        console.error("createCheckoutSessionAction error:", err);
        throw new Error(err.message || "Failed to connect to the backend server");
    }
}