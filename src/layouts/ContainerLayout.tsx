import React from 'react'

export default function ContainerLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className='w-[90%] xl:w-[75%] mx-auto mt-[7.5rem]'>
            {children}
        </section>
  )
}
