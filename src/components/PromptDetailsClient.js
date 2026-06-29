"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Bookmark, Star, Copy, Flag, Check, 
    Lock, ArrowRight, MessageSquare, Terminal, Calendar 
} from "lucide-react";
import { 
    toggleBookmarkAction, 
    addReviewAction, 
    reportPromptAction, 
    incrementCopyCountAction 
} from "@/lib/actions";
import toast from "react-hot-toast";

export default function PromptDetailsClient({ prompt, reviews: initialReviews = [], isBookmarked: initialBookmarked = false, currentUser }) {
    const router = useRouter();
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [reviews, setReviews] = useState(initialReviews);
    
    // Copy State
    const [copied, setCopied] = useState(false);
    const [copyCount, setCopyCount] = useState(prompt.copyCount || 0);

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Report Modal State
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("Inappropriate Content");
    const [reportDescription, setReportDescription] = useState("");
    const [submittingReport, setSubmittingReport] = useState(false);

    // Handle Bookmark Toggle
    const handleBookmark = async () => {
        try {
            const res = await toggleBookmarkAction(prompt._id);
            setBookmarked(res.bookmarked);
            toast.success(res.message);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Handle Copy to Clipboard
    const handleCopy = async () => {
        if (prompt.isLocked) {
            toast.error("This is a premium prompt. Subscribe to view and copy!");
            return;
        }

        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setCopyCount(prev => prev + 1);
            toast.success("Prompt copied to clipboard!");
            
            // Increment count on server
            await incrementCopyCountAction(prompt._id);
            
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy prompt");
        }
    };

    // Handle Review Submit
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error("Please add a comment");
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await addReviewAction(prompt._id, rating, comment);
            toast.success("Review posted successfully!");
            
            // Append review dynamically to list
            const newReview = {
                _id: Date.now().toString(),
                name: currentUser?.name || "You",
                email: currentUser?.email || "",
                rating,
                comment,
                createdAt: new Date().toISOString()
            };
            setReviews(prev => [newReview, ...prev]);
            
            setComment("");
            setRating(5);
        } catch (err) {
            toast.error(err.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    // Handle Report Submit
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReport(true);
        try {
            await reportPromptAction(prompt._id, reportReason, reportDescription);
            toast.success("Prompt reported. Admins will review this.");
            setReportModalOpen(false);
            setReportDescription("");
        } catch (err) {
            toast.error(err.message || "Failed to submit report");
        } finally {
            setSubmittingReport(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-zinc-950">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Details */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 uppercase">
                                {prompt.aiTool}
                            </span>
                            <span className="rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                                {prompt.category}
                            </span>
                            <span className="rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                                {prompt.difficulty}
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                            {prompt.title}
                        </h1>

                        <p className="mt-4 text-zinc-400 text-base leading-relaxed">
                            {prompt.description}
                        </p>
                    </div>

                    {/* Prompts content window */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
                            <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider font-mono">Prompt Content</span>
                            <button
                                onClick={handleCopy}
                                disabled={prompt.isLocked}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-md transition-all cursor-pointer ${
                                    prompt.isLocked 
                                        ? "bg-zinc-950/40 border-zinc-900 text-zinc-600 cursor-not-allowed"
                                        : "bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                                }`}
                            >
                                {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>

                        <div className={`p-4 rounded-xl font-mono text-sm leading-relaxed ${prompt.isLocked ? "blur-md select-none bg-zinc-950/20 text-zinc-700" : "bg-zinc-950 text-zinc-200"}`}>
                            {prompt.content}
                        </div>

                        {/* Premium Overlay Gate */}
                        {prompt.isLocked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-950/70 backdrop-blur-md text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 animate-bounce">
                                    <Lock size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Premium Prompt</h3>
                                <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
                                    This prompt is locked. Upgrade to Premium for a one-time fee of just $5 to unlock instant access.
                                </p>
                                <button
                                    onClick={() => router.push("/payment")}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg cursor-pointer"
                                >
                                    Subscribe to Premium
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Usage Instructions */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight">Usage Instructions</h3>
                        <div className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 text-sm text-zinc-400 leading-relaxed space-y-2">
                            {prompt.instructions ? (
                                <p>{prompt.instructions}</p>
                            ) : (
                                <p>To run this prompt, copy the content and substitute the variable placeholders (e.g. [variableName]) with your specific context. We recommend feeding this prompt directly to the AI as a system instruction or opening prompt.</p>
                            )}
                        </div>
                    </div>

                    {/* Review Form & Reviews List */}
                    <div className="space-y-6 pt-6 border-t border-zinc-900">
                        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            <MessageSquare size={18} className="text-indigo-400" />
                            Community Reviews ({reviews.length})
                        </h3>

                        {/* Review Input (If not premium locked) */}
                        {!prompt.isLocked && currentUser && (
                            <form onSubmit={handleReviewSubmit} className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold text-zinc-300">Your Rating:</span>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="cursor-pointer"
                                                aria-label={`Rate ${star} stars`}
                                            >
                                                <Star
                                                    size={18}
                                                    className={star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-600 hover:text-amber-300"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    required
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your review about the efficiency of this prompt..."
                                    className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                                >
                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        )}

                        {/* Reviews list */}
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-sm text-zinc-500 italic">No reviews yet. Be the first to leave a feedback!</p>
                            ) : (
                                reviews.map((rev) => (
                                    <div key={rev._id} className="p-5 rounded-xl border border-zinc-800/60 bg-zinc-900/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <span className="text-sm font-bold text-white block">{rev.name}</span>
                                                <span className="text-[10px] text-zinc-500 font-mono">{rev.email}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed mt-2">{rev.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side Column - Metadata Summary */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm space-y-6">
                        <h3 className="text-base font-bold text-white tracking-tight border-b border-zinc-800 pb-3">Prompt Specifications</h3>
                        
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Model Support</span>
                                <span className="font-semibold text-zinc-300">{prompt.aiTool}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Category</span>
                                <span className="font-semibold text-zinc-300">{prompt.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Difficulty</span>
                                <span className="font-semibold text-zinc-300">{prompt.difficulty}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Total Copies</span>
                                <span className="font-semibold text-zinc-300">{copyCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Avg Rating</span>
                                <span className="font-semibold text-zinc-300 flex items-center gap-1">
                                    <Star className="fill-amber-500 text-amber-500" size={13} />
                                    {prompt.rating ? prompt.rating.toFixed(1) : "0.0"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Submit Date</span>
                                <span className="font-semibold text-zinc-300 flex items-center gap-1">
                                    <Calendar size={13} />
                                    {new Date(prompt.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Buttons (Bookmark, Report) */}
                        <div className="space-y-3 pt-6 border-t border-zinc-800">
                            {currentUser && (
                                <>
                                    <button
                                        onClick={handleBookmark}
                                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold border shadow-md transition-all cursor-pointer active:scale-95 ${
                                            bookmarked
                                                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
                                                : "bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                                        }`}
                                    >
                                        <Bookmark size={15} className={bookmarked ? "fill-indigo-400" : ""} />
                                        {bookmarked ? "Saved in Bookmarks" : "Bookmark Prompt"}
                                    </button>

                                    <button
                                        onClick={() => setReportModalOpen(true)}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-950/20 text-red-400 hover:bg-red-950/30 border border-red-500/10 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
                                    >
                                        <Flag size={15} />
                                        Report Prompt
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Creator box */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm text-center">
                        <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-4">Prompt Engineer</h4>
                        <div className="relative mx-auto mb-3 h-14 w-14 rounded-full overflow-hidden border border-zinc-800">
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(prompt.creatorName || "U")}`}
                                alt="Creator"
                                className="object-cover"
                            />
                        </div>
                        <h4 className="text-sm font-bold text-white">{prompt.creatorName || "Anonymous"}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{prompt.creatorEmail || "creator@prompt-sphere.com"}</p>
                    </div>
                </div>
            </div>

            {/* Report Prompt Modal */}
            {reportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                        <h3 className="text-lg font-bold text-white mb-2">Report Prompt</h3>
                        <p className="text-xs text-zinc-400 mb-6">
                            Let us know why this prompt should be flagged. Admin moderators will evaluate your claim.
                        </p>

                        <form onSubmit={handleReportSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Reason
                                </label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none cursor-pointer"
                                >
                                    <option value="Inappropriate Content">Inappropriate Content</option>
                                    <option value="Spam">Spam</option>
                                    <option value="Copyright Violation">Copyright Violation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    placeholder="Enter additional details..."
                                    className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
                                <button
                                    type="button"
                                    onClick={() => setReportModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingReport}
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                                >
                                    {submittingReport ? "Flagging..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
