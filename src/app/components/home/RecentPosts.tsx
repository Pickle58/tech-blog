import Image from "next/image"
import Link from "next/link"

export const posts = [
    {
        id: 1,
        title: "Is PHP really dead or is it a myth",
        excerpt: "PHP is often labeled as dead, but is it really? In this article, we will explore the current state of PHP and its relevance in the modern web development landscape.",
        date: "Sep 12, 2025",
        slug: "is-PHP-really-dead-or-is-it-a-myth",
        image: "/images/p1.png",
    },
    {
        id: 2,
        title: "Dark Mode Done Right in Tailwind",
        excerpt: "A practical guide to implementing dark mode in your Tailwind CSS projects, ensuring a seamless user experience across different themes.",
        date: "Sep 5, 2025",
        slug: "dark-mode-tailwind",
        image: "/images/p2.png",
    },
    {
        id: 3,
        title: "Why Clean UI Matters for Blogs",
        excerpt: "How typography, spacing, and contrast affect readability and user engagement, and why a clean UI is essential for a successful blog.",
        date: "Aug 29, 2025",
        slug: "clean-ui",
        image: "/images/p3.png",
    },
]

export default function RecentPosts() {
    return (
        <div className='space-y-2 mb-10'>
            <h2 className='text-white text-xl sm:text-2xl md:text-3xl font-semibold'>
                Recent Posts
            </h2>
            {/* recent post cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {posts.map((post) => {
                    return (
                        <div key={post.id} className="group rounded-xl overflow-hidden bg-[#0b0b0b] border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                            {/* image */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    fill
                                />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>

                            {/* content */}
                            <div className="p-5 space-y-3">
                                <time className="text-xs text-gray-400">{post.date}</time>
                                <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link href={`/articles/${post.slug}`} 
                                className="inline-block text-sm font-medium text-indigo-400 hover:underline" >
                                    Read Article
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
