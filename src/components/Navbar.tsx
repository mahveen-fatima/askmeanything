"use client"
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className='border-b border-gray-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link href="/" className='text-2xl font-bold text-gray-800'>
            AMA
          </Link>

          <div className='hidden sm:flex sm:items-center'>
            {session ? (
              <>
                <span className='mr-4'>Welcome, {user?.username}</span>
                <Button onClick={() => signOut()}>Logout</Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          <div className='sm:hidden'>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label='Toggle menu'>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className='sm:hidden px-4 pt-2 pb-3 space-y-1'>
          {session ? (
            <>
              <div className='px-3 py-2'>Welcome, {user?.username}</div>
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className='block sm:w-full md:w-auto text-left px-3 py-2 font-medium hover:bg-gray-100 rounded'
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className='w-full'>Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
