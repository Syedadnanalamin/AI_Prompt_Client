export default function LoadingPage() {
    return (
        <div className="flex-grow bg-zinc-950 flex flex-col items-center justify-center py-24">
            <div className="space-y-4 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto" />
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest animate-pulse">Loading Environment...</p>
            </div>
        </div>
    );
}
