"use client"

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { User } from "next-auth"
import { Button } from './ui/button'

const Navbar = () => {

    const { data: session } = useSession()

    const user: User = session?.user as User

  return (
    <nav className='p-4 border border-b-gray-500/20'>
        <div className='mx-auto lg:mx-16 flex flex-col md:flex-row justify-between items-center'>
            <Link
                className='text-xl font-bold mb-4 md:mb-0 bg-gray-400 px-2 py-1 rounded-lg' 
                href="/">
                AMA
            </Link>
            <div>

            {
                session ? (
                    <>
                        <span className='mr-4'>
                            Welcome, {user?.username}
                        </span>
                        <Button className='w-full md:w-auto bg-stone-950 hover:bg-neutral-700 cursor-pointer' onClick={ () => signOut() }>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button  className='w-full md:w-auto bg-stone-950 hover:bg-neutral-700 cursor-pointer'>Login</Button>
                    </Link>
                )
            }
            </div>
        </div>
    </nav>
  )
}

export default Navbar