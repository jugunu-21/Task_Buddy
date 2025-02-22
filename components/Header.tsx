'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '../lib/firebase';
import {  useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserId } from '@/lib/redux/features/taskSlice';
import Cookies from 'js-cookie';

export default function Header({ viewMode, setViewMode }: { viewMode: 'list' | 'board', setViewMode: (viewMode: 'list' | 'board') => void }) {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>('/person.svg');
  const [userName, setUserName] = useState<string>('User');
const dispatch=useDispatch()
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserPhoto(user.photoURL || '/person.svg');
        setUserName(user.displayName || 'User');
        dispatch(setUserId(user.uid))
        console.log("user.uidFt",user.uid)
      } else {
        setUserPhoto('/person.svg');
        setUserName('User');
        dispatch(setUserId('')); // Clear user ID when logged out
      }
    });

    return () => unsubscribe();
  }, [dispatch]); // Add dispatch to dependency array

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Remove the firebase-token cookie using js-cookie
      Cookies.remove('firebase-token', { path: '/' });
      // Use replace instead of push to prevent back navigation after logout
      router.replace('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center space-x-2">
            <Image
              src="/window.svg"
              alt="TaskBuddy Logo"
              width={16}
              height={16}
              priority={true}
            />
            <span className="text-purple-500 text-xl font-bold">TaskBuddy</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 mt-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium text-gray-700 ${viewMode === 'list' ? 'border-b-2 border-purple-500' : ''} hover:border-b-2 hover:border-purple-500 focus:outline-none focus:bg-gray-100 focus:border-b-2 focus:border-purple-500 flex items-center gap-2`}
            >
              <Image src="/file.svg" alt="List Icon" width={16} height={16} priority={true} />
              List
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`px-3 py-2 text-sm font-medium text-gray-700 ${viewMode === 'board' ? 'border-b-2 border-purple-500' : ''} hover:border-b-2 hover:border-purple-500 focus:outline-none focus:bg-gray-100  focus:border-b-2 focus:border-purple-500 flex items-center gap-2`}
            >
              <Image src="/globe.svg" alt="Board Icon" width={16} height={16} priority={true} />
              Board
            </button>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 py-2 ml-auto pl-auto">
            <Image
              src={userPhoto}
              alt="User Avatar"
              width={24}
              height={24}
              priority={true}
              className="border-2 w-6 h-6 rounded-full"
            />
            <div className="text-gray-700">{userName}</div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center gap-2"
          >
            <Image src="/file.svg" alt="Logout Icon" width={16} height={16} priority={true} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}