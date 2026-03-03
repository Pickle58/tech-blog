"use client"

import { useModalStore } from '@/store/useModalStore'
import Modal from './Modal'

const results = [
    {
        id: 1,
        title: "Building a Medium-Style Blog with Next.js",
        slug: "/articles/medium-style-blog",
    },
    {
        id: 2,
        title: "Dark Mode in Web Design: Tips and Best Practices",
        slug: "/articles/dark-mode-tailwind",
    },
];

export default function SearchModal() {
    const { isSearchOpen, closeSearch } = useModalStore()
  return (
    <Modal onClose={closeSearch} isOpen={isSearchOpen}>
        <div className='space-y-4'>
            <input type="text" placeholder='Search articles' autoFocus
            className='w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white text-lg outline-none focus:border-indigo-500' />
        <div className='max-h-80 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/10'>
        </div>

            {results.map((result) => {
                return (
                   <button key={result.id} className='w-full text-left px-4 py-3 text-gray-300 transition hover:bg-white/5 hover:text-white cursor-pointer'>
                    {result.title}
                   </button> 
                )
            })}
        </div>
    </Modal>
  )
}
