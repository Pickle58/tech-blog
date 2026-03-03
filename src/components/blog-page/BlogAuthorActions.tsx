"use client"

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { LuPen, LuTrash } from 'react-icons/lu'
import { authClient } from '@/lib/auth-client'

type BlogAuthorActionsProps = {
  authorId: string
  postId: string
}

export default function BlogAuthorActions({ authorId, postId }: BlogAuthorActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: session } = authClient.useSession()
  const userId = session?.user.id

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this post permanently?')

    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)

      await axios.delete(`/api/posts/${postId}`)

      toast('Post deleted successfully', {
        style: { color: 'white', background: '#1e3a8a' },
      })

      router.push('/articles')
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data?.error || 'Failed to delete post', {
          style: { color: 'white', background: '#1e3a8a' },
        })
      } else {
        toast('Failed to delete post', {
          style: { color: 'white', background: '#1e3a8a' },
        })
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (userId !== authorId) {
    return null
  }

  return (
    <div className='flex items-center justify-end gap-2'>
      <Link
        href={`/write/edit/${postId}`}
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
        onClick={handleDelete}
        disabled={isDeleting}
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
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}
