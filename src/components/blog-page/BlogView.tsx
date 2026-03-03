import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/server-actions/getPost'
import sanitizeHtml from 'sanitize-html'
import BlogAuthorActions from '@/components/blog-page/BlogAuthorActions'

type BlogViewProps = {
    postPromise: ReturnType<typeof getPostBySlug>
}

export default async function BlogView({ postPromise }: BlogViewProps) {
    const post = await postPromise

    if (!post) {
        notFound()
    }

    const sanitizedContent = sanitizeHtml(post.content, {
        allowedTags: [
            'p',
            'br',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'strong',
            'em',
            'u',
            's',
            'blockquote',
            'ul',
            'ol',
            'li',
            'code',
            'pre',
            'a',
            'hr',
        ],
        allowedAttributes: {
            a: ['href', 'target', 'rel'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: {
            a: sanitizeHtml.simpleTransform('a', {
                rel: 'noopener noreferrer',
                target: '_blank',
            }),
        },
    })

    return (
        <article className='max-w-3xl mx-auto py-20 px-6'>
            {/* article header */}
            <header className='mb-10'>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4'>
                    {post.title}
                </h1>

                <div className='flex items-center gap-4 text-sm text-gray-400'>
                    {post.author.image && (
                        <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                            <Image
                                src={post.author.image}
                                alt={post.author.name}
                                fill
                                sizes="40px"
                                className='object-cover'
                            />
                        </div>
                    )}
                    <span>By {post.author.name}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </header>

            <div className='relative w-full h-55 sm:h-80 lg:h-105 mb-12'>
                <Image
                    src={post.coverImageURL}
                    alt={post.title}
                    fill
                    className='rounded-2xl object-cover' />
            </div>

            {/* article content */}
            <div className='max-w-none text-gray-400 leading-relaxed tracking-wide blog-post'>
                <div className='space-y-6' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>
            <div className='border border-white/10 my-16' />

            <BlogAuthorActions authorId={post.author.id} postId={post.id} />

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
