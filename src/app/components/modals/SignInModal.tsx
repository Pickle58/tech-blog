"use client"

import { useModalStore } from '@/store/useModalStore'
import Modal from './Modal'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { authClient } from '@/lib/auth-client'

export default function SignInModal() {
    const { isSignInOpen, closeSignIn } = useModalStore()

    const signInWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
        })
    }

    const signInWithGithub = async () => {
        await authClient.signIn.social({
            provider: "github",
        })
    }

    return (
        <Modal onClose={closeSignIn} isOpen={isSignInOpen}>
            <h2 className='text-xl font-semibold text-white mb-2'>
                Sign in to TechBlog
            </h2>
            <p className='text-sm text-gray-400 mb-8'>
                Continue with one of the providers below.
            </p>
            <div className='space-y-4'>
                {/* google */}
                <button 
                onClick={signInWithGoogle}
                className='w-full flex items-center justify-center gap-3
                py-3 rounded-full cursor-pointer
                bg-white text-black font-medium
                hover:bg-gray-200 transition'>
                    <FcGoogle className='text-xl' />
                    Continue with Google
                </button>
                {/* github */}
                <button 
                onClick={signInWithGithub}
                className='w-full flex items-center justify-center gap-3
                py-3 rounded-full cursor-pointer
                bg-black text-white font-medium
                hover:bg-gray-800 transition'>
                    <FaGithub className='text-xl' />
                    Continue with Github
                </button>
            </div>
            <p className='text-xs text-gray-500 mt-8 text-center'>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </Modal>
    )
}
