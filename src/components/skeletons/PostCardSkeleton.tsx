

export default function PostCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {[...Array(3)].map((_,index) => (
            <div key={index} className="rounded-xl overflow-hidden
            bg-[#0B0B0B]  
            border border-white/10        
            animate-pulse">
                {/* image skeleton */}
                <div className="h-48 w-full bg-white/10"/>

                {/* content skeleton */}
                <div className="p-5 space-y-6">
                    <div className="h-3 w-24 bg-white/10 rounded"/>

                    <div className="h-5 w-3/4 bg-white/10 rounded"/>

                    <div className="space-y-2">
                        <div className="h-4 w-full bg-white/10 rounded"/>
                        <div className="h-4 w-full bg-white/10 rounded"/>
                        <div className="h-4 w-full bg-white/10 rounded"/>
                    </div>

                    <div className="h-4 w-28 bg-white/10 rounded"/>

                </div>

            </div>
        ))}
    </div>
  )
}