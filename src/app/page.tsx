import ContainerLayout from "@/layouts/ContainerLayout";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import RecentPosts from "@/components/home/RecentPosts";
import { Suspense } from "react";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";

export default function Home() {
  return (
    <ContainerLayout>
      <h1 className="text-3xl lg:text-5xl xl:text-7xl text-center text-gray-200 tracking-wide leading-snug lg:leading-tight">
        <span className="font-bold">Welcome to TechBlog!</span><br />Discover Stories and Creative Ideas
      </h1>
      <div className="py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* image */}
          <div className="relative">
            <Image
              src="/images/about.png"
              alt="About TechBlog"
              width={600}
              height={600}
              className="rounded-2xl border border-white/10"
            />
            {/* glow */}
            <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl -z-10" />
          </div>

          {/* contents */}
          <div className="max-w-xl">
            <span className="text-sm uppercase tracking-widest text-indigo-400">
              About TechBlog
            </span>
            <h3 className="mt-3 text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-tight text-white">
              Simple Ways to Innovate Your Inner Creative Mind
            </h3>
            <p className="mt-6 text-gray-400 leading-relaxed">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque atque reprehenderit, magni similique ut harum? Cum earum repellat facere id corrupti est?
            </p>
            <div className="mt-10">
              <Link href="/about" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-secondary-background border border-white/10 text-gray-200 font-semibold hover:bg-white/10 transition-colors">
              Learn More
              <LuArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<PostCardSkeleton />}>
        <RecentPosts />
      </Suspense>
    </ContainerLayout>
  );
}
