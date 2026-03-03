import Image from 'next/image'
import Link from 'next/link'
import { LuPen, LuTrash } from 'react-icons/lu'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/server-actions/getPost'

type BlogViewProps = {
  postPromise: ReturnType<typeof getPostBySlug>
}

export default async function BlogView({ postPromise }: BlogViewProps) {
  const post = await postPromise

  if (!post) {
    notFound()
  }

  return (
    <article className='max-w-3xl mx-auto py-20 px-6'>
            {/* article header */}
            <header className='mb-10'>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4'>
                    {post.title}
                </h1>

                <div className='flex items-center gap-4 text-sm text-gray-400'>
                    <span>By {post.author.name}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </header>

            <div className='relative w-full h-55 sm:h-80 lg:h-105 mb-12'>
                <Image src={post.coverImageURL} alt={post.title} fill className='rounded-2xl object-cover' />
            </div>

            {/* article content */}
            <div className='max-w-none text-gray-400 leading-relaxed tracking-wide'>
                <p className='mb-6'>
                    {post.content}
                </p>
            </div>
            <div className='border border-white/10 my-16' />
            <div className='flex items-center justify-end gap-2'>
                <Link href="#"
                    className=" inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                text-sm font-medium
                text-indigo-400
                border border-indigo-400/20
                hover:border-indigo-400/40
                hover:bg-indigo-400/10
                transition">
                    <LuPen size={15} />
                    Edit
                </Link>
                <button type='button'
                    className="inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                text-sm font-medium
                text-red-400
                border border-red-400/20
                hover:border-red-400/40
                hover:bg-red-400/10
                transition cursor-pointer
                disabled:cursor-not-allowed">
                    <LuTrash size={15} />
                    Delete
                </button>
            </div>

            <div className='mt-16'>
                <Link
                    href="/articles"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    ← Back to all articles
                </Link>
            </div>
        </article>
  )
}
