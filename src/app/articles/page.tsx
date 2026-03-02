import ContainerLayout from "@/layouts/ContainerLayout"
import Link from "next/link"
import Image from "next/image"
import { posts } from "../components/home/RecentPosts"

export default function ArticlesPage() {
    return (
        <ContainerLayout>
            <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-semibold">
                    All Articles
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="group overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    fill
                                />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>

                            <div className="space-y-3 p-5">
                                <time className="text-xs text-gray-400">{post.date}</time>
                                <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-indigo-400">
                                    {post.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">{post.excerpt}</p>
                                <Link
                                    href={`/articles/${post.slug}`}
                                    className="inline-block text-sm font-medium text-indigo-400 hover:underline"
                                >
                                    Read Article
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <button className="px-8 py-3 cursor-pointer rounded-full border border-white/10 bg-secondary-background font-medium text-gray-300 transition-all duration-300 hover:border-white/20 hover:text-white">
                        Load more articles
                    </button>
                </div>
            </div>
        </ContainerLayout>
    )
}
