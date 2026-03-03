import BlogView from "@/components/blog-page/BlogView";
import PostViewSkeleton from "@/components/skeletons/PostViewSkeleton";
import { getPostBySlug } from "@/server-actions/getPost";
import { Suspense } from "react";

export default async function PostViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const slug = (await params).slug;
  const postPromise = getPostBySlug(slug);
  return (
    <Suspense fallback={ <PostViewSkeleton/> }>
      <BlogView postPromise={postPromise}/>
    </Suspense>
  )
}