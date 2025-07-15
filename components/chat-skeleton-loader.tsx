export default function ChatSkeletonLoader() {
    return (
        <div className="flex flex-col gap-4 w-full animate-pulse">
            {/* Simulated greeting */}
            <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-72 bg-gray-700 rounded" />
                <div className="h-6 w-56  bg-gray-700 rounded" />
            </div>

            {/* Simulated chat input box */}
            <div className="w-full p-4 border-t border-slate-700 bg-slate-800 rounded-2xl flex flex-col gap-4">
                <div className="h-10 w-full bg-gray-700 rounded" />
                <div className="flex justify-between items-center">
                    <div className="h-10 w-10 bg-gray-700 rounded-full" />
                    <div className="flex gap-2">
                        <div className="h-10 w-10 bg-gray-700 rounded-full" />
                        <div className="h-10 w-10 bg-gray-700 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
