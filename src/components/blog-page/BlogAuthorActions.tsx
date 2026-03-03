"use client"

import Link from 'next/link'
import { LuPen, LuTrash } from 'react-icons/lu'
import { authClient } from '@/lib/auth-client'

type BlogAuthorActionsProps = {
  authorId: string
}

export default function BlogAuthorActions({ authorId }: BlogAuthorActionsProps) {
  const { data: session } = authClient.useSession()
  const userId = session?.user.id

  if (userId !== authorId) {
    return null
  }

  return (
    <div className='flex items-center justify-end gap-2'>
      <Link
        href="#"
        className=" inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                text-sm font-medium
                text-indigo-400
                border border-indigo-400/20
                hover:border-indigo-400/40
                hover:bg-indigo-400/10
                transition"
      >
        <LuPen size={15} />
        Edit
      </Link>
      <button
        type='button'
        className="inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                text-sm font-medium
                text-red-400
                border border-red-400/20
                hover:border-red-400/40
                hover:bg-red-400/10
                transition cursor-pointer
                disabled:cursor-not-allowed"
      >
        <LuTrash size={15} />
        Delete
      </button>
    </div>
  )
}
