import ContainerLayout from '@/layouts/ContainerLayout'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AboutPage() {
    return (
        <ContainerLayout>
            <div className='px-4 sm:px-12'>
                {/* heading */}
                <div className='text-center mb-16'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4'>
                        About TechBlog
                    </h1>
                    <p className='text-gray-400 max-w-2xl mx-auto leading-relaxed'>
                        A modern tech blog about real-world development, and thoughtful engineering.
                    </p>
                </div>
                {/* content */}
                <div className='space-y-14'>
                    {/* section 1 */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
                        <Image
                            src="/images/about.png"
                            alt="about-image"
                            width={600}
                            height={600}
                            className='rounded-2xl object-cover' />
                        <div>
                            <h2 className='text-2xl font-semibold text-gray-200 mb-4'>
                                Why TechBlog?
                            </h2>
                            <p className='text-gray-400 leading-relaxed'>
                                TechBlog was created to share insights on modern technologies
                                and web development. We focus on practical concepts, clean code,
                                and real tools—helping developers understand how things work and
                                how to build better applications.
                            </p>
                        </div>
                    </div>
                </div>

                {/* section 2 */}
                <div className='bg-secondary-background rounded-2xl p-8 border border-white/10'>
                    <h2 className='text-2xl font-semibold text-gray-200 mb-4'>
                        What We Write About
                    </h2>
                    <ul className='space-y-3 text-gray-400'>
                        <li>• Modern web technologies and frameworks</li>
                        <li>
                            • Frontend development with React, Next.js, and Tailwind CSS
                        </li>
                        <li>• Backend tools, APIs, and application architecture</li>
                        <li>• Practical guides and insights for web developers</li>
                    </ul>
                </div>

                {/* section 3 */}
                <div className='text-center'>
                    <h2 className='text-2xl font-semibold text-gray-200 mb-4'>
                        Built for Developers
                    </h2>
                    <p className='text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8'>
                         Whether you&apos;re just starting out or refining your skills, TechBlog
              is designed to inspire better code, better design, and better
              thinking.
                    </p>
                    <Link href="/articles" className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold'>
                    Explore
                    </Link>
                </div>
            </div>
        </ContainerLayout>
    )
}
