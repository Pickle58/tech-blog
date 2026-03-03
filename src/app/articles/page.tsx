"use client";

import PostCardSkeleton from "@/components/skeletons/PostViewSkeleton";
import { useInfinitePosts } from "@/custom-hooks/usePost";
import ContainerLayout from "@/layouts/ContainerLayout";
import Image from "next/image";
import Link from "next/link";


export default function ArticlesPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfinitePosts({ limit: 3 });

    if(isPending){
      return (
        <ContainerLayout>
           <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-semibold">
          All Articles
        </h2>

        <PostCardSkeleton/>
        </ContainerLayout>
      )
    }

    if(isError){
        return (
        <ContainerLayout>
          <p className="text-gray-300">Failed to load articles</p>
        </ContainerLayout>
      )
    }

    const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  return (
    <ContainerLayout>
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-semibold">
          All Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            return (
              <div
                key={post.id}
                className="group rounded-xl overflow-hidden bg-[#0B0B0B] border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                {/* image */}
               {post.coverImageURL && (
                 <div className="relative h-48 w-full overflow-hidden">
                  <Image
                  src={post.coverImageURL}
                  alt={post.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
               )}

                {/* content */}
                <div className="p-5 space-y-3">
                  <time className="text-xs text-gray-400">
                     {
                    new Date(post.createdAt).toLocaleDateString("en-GB",{
                      day:"2-digit",
                      month:"short",
                      year:"numeric"                      
                    })
                  }
                  </time>

                  <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/articles/${post.slug}`}
                    className="inline-block text-sm font-medium text-indigo-400 hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

     {hasNextPage && (
         <div className="flex justify-center mt-10">
          <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
            className=" px-8 py-3 rounded-full
      bg-secondary-background
      text-gray-300 text-sm font-medium
      border border-white/10
      hover:border-white/20
      hover:text-white
      transition-all duration-300 cursor-pointer"
          >
            {isFetchingNextPage ? "Loading..." : "Load more articles"}
          </button>
        </div>
     )}
      </div>
    </ContainerLayout>
  );
}