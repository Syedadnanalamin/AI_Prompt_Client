import { getPrompts } from "@/lib/api";
import PromptsFilters from "@/components/PromptsFilters";
import FeaturedPrompts from "@/components/FeaturedPrompts";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export const revalidate = 0; // Disable caching to fetch live data updates

export default async function PromptsPage({ searchParams }) {
    // Await query parameters
    const params = await searchParams;
    const search = params.search || "";
    const category = params.category || "";
    const aiTool = params.aiTool || "";
    const difficulty = params.difficulty || "";
    const sort = params.sort || "Latest";
    const page = parseInt(params.page || "1");
    const limit = 6;

    const data = await getPrompts({ search, category, aiTool, difficulty, sort, page, limit });
    const { prompts = [], total = 0, pages = 0, currentPage = 1 } = data;

    // Helper to generate pagination URLs
    const getPageUrl = (pageNum) => {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("search", search);
        if (category) queryParams.set("category", category);
        if (aiTool) queryParams.set("aiTool", aiTool);
        if (difficulty) queryParams.set("difficulty", difficulty);
        if (sort) queryParams.set("sort", sort);
        queryParams.set("page", pageNum.toString());
        return `/prompts?${queryParams.toString()}`;
    };

    return (
        <div className="flex-1 bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        Prompts Marketplace
                    </h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Search and filter our database of approved prompts across popular categories and difficulty levels.
                    </p>
                </div>

                {/* Filters Panel */}
                <PromptsFilters />

                {/* Prompts Cards Grid */}
                {prompts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
                        <Inbox className="mx-auto text-zinc-600 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-white mb-1">No prompts found</h3>
                        <p className="text-sm text-zinc-500 max-w-md mx-auto">
                            Try adjusting your filters or search keywords to locate prompts, or create your own prompt!
                        </p>
                    </div>
                ) : (
                    <>
                        <FeaturedPrompts initialPrompts={prompts} />

                        {/* Server-Side Pagination Controls */}
                        {pages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-zinc-900">
                                {currentPage > 1 ? (
                                    <Link
                                        href={getPageUrl(currentPage - 1)}
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg border border-zinc-800/40 bg-zinc-950 text-zinc-600 cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                )}

                                <span className="text-sm text-zinc-500 font-medium">
                                    Page <span className="text-zinc-300">{currentPage}</span> of <span className="text-zinc-300">{pages}</span>
                                </span>

                                {currentPage < pages ? (
                                    <Link
                                        href={getPageUrl(currentPage + 1)}
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg border border-zinc-800/40 bg-zinc-950 text-zinc-600 cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
