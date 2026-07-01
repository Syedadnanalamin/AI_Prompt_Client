import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

// Helper to get authenticated headers for server components
async function getAuthHeaders() {
    try {
        const cookieStore = await cookies();
        let token = cookieStore.get("better-auth.session_token")?.value;
        if (token) {
            if (token.includes(".")) {
                token = token.split(".")[0];
            }
            return { "Authorization": `Bearer ${token}` };
        }
    } catch (e) {
        // cookies() may throw if called in a client context
    }
    return {};
}

// 1. Get Prompts Marketplace (Search, Filter, Sort, Pagination)
export async function getPrompts(searchParams = {}) {
    try {
        const params = new URLSearchParams();
        if (searchParams.search) params.append("search", searchParams.search);
        if (searchParams.category) params.append("category", searchParams.category);
        if (searchParams.aiTool) params.append("aiTool", searchParams.aiTool);
        if (searchParams.difficulty) params.append("difficulty", searchParams.difficulty);
        if (searchParams.sort) params.append("sort", searchParams.sort);
        if (searchParams.page) params.append("page", searchParams.page);
        if (searchParams.limit) params.append("limit", searchParams.limit);

        const res = await fetch(`${BACKEND_URL}/api/prompts?${params.toString()}`, {
            cache: "no-store"
        });
        if (!res.ok) return { prompts: [], total: 0, pages: 0, currentPage: 1 };
        return await res.json();
    } catch (err) {
        console.error("getPrompts API error:", err.message);
        return { prompts: [], total: 0, pages: 0, currentPage: 1 };
    }
}

// 2. Get Featured Prompts
export async function getFeaturedPrompts() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/prompts/featured`, {
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("getFeaturedPrompts API error:", err.message);
        return [];
    }
}

// 3. Get Prompt Details
export async function getPromptDetails(id) {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/prompts/details/${id}`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error("getPromptDetails API error:", err.message);
        return null;
    }
}

// 4. Get Top Creators
export async function getTopCreators() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/creators/top`, {
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("getTopCreators API error:", err.message);
        return [];
    }
}

// 5. Get Reviews for Prompt
export async function getReviewsForPrompt(id) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/reviews/prompt/${id}`, {
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("getReviewsForPrompt API error:", err.message);
        return [];
    }
}

// 6. Get User Reviews
export async function getUserReviews() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/reviews/user`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("getUserReviews API error:", err.message);
        return [];
    }
}

// 7. Get Bookmarked Prompts
export async function getBookmarkedPrompts() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/bookmarks`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("getBookmarkedPrompts API error:", err.message);
        return [];
    }
}

// 8. Get Creator's Own Prompts
export async function getMyPrompts() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/my-prompts`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("getMyPrompts API error:", err.message);
        return [];
    }
}

// 9. Get Creator Analytics
export async function getCreatorAnalytics() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/creator/analytics`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return { totalPrompts: 0, totalCopies: 0, totalBookmarks: 0, promptList: [] };
        return await res.json();
    } catch (err) {
        console.error("getCreatorAnalytics API error:", err.message);
        return { totalPrompts: 0, totalCopies: 0, totalBookmarks: 0, promptList: [] };
    }
}

// ================= ADMIN GET APIS =================

// A1. Admin Get All Users
export async function adminGetUsers() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("adminGetUsers API error:", err.message);
        return [];
    }
}

// A2. Admin Get All Prompts
export async function adminGetPrompts() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/prompts`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("adminGetPrompts API error:", err.message);
        return [];
    }
}

// A3. Admin Get Reported Prompts
export async function adminGetReports() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/reports`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("adminGetReports API error:", err.message);
        return [];
    }
}

// A4. Admin Get Payments Log
export async function adminGetPayments() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/payments`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("adminGetPayments API error:", err.message);
        return [];
    }
}

// A5. Admin Get Global Analytics
export async function adminGetAnalytics() {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/analytics`, {
            headers: authHeaders,
            cache: "no-store"
        });
        if (!res.ok) return { totalUsers: 0, totalPrompts: 0, totalReviews: 0, totalCopies: 0 };
        return await res.json();
    } catch (err) {
        console.error("adminGetAnalytics API error:", err.message);
        return { totalUsers: 0, totalPrompts: 0, totalReviews: 0, totalCopies: 0 };
    }
}
