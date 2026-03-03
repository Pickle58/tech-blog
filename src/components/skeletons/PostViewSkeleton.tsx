

export default function PostViewSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-pulse">
        <header className="mb-10">
            <div className="h-10 sm:h-12 lg:h-14 bg-white/10 rounded mb-10"/>

            <div className="flex gap-4 items-center text-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10"/>

                    <div className="space-y-2">
                        <div className="h-4 w-28 bg-white/10 rounded"/>
                        <div className="h-3 w-20 bg-white/10 rounded"/>
                    </div>
                </div>
                
                <div className="w-1 h-1 bg-white/10 rounded-full"/>
                <div className="h-4 w-24 bg-white/10 rounded"/>
            </div>
        </header>

        <div className="w-full h-55 sm:h-80 lg:h-105 mb-12 bg-white/10 rounded-2xl"/>

        <div className="space-y-4">
            <div className="h-4 bg-white/10 rounded"/>
            <div className="h-4 bg-white/10 rounded"/>
            <div className="h-4 bg-white/10 rounded w-3/4"/>
        </div>

        <div className="mt-16">
            <div className="h-4 w-40 bg-white/10 rounded"/>
        </div>
    </div>
  )
}