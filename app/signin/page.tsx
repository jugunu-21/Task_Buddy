
'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      Cookies.set('firebase-token', idToken, {
        expires: 2, // 2 days
        path: '/',
        secure: true
      });
      router.replace('/');
    } catch (error) {
      console.error('Authentication error:', error);
      document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-1/2 flex items-center justify-center">
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-[#7B1984] text-4xl font-bold mb-6 flex items-center gap-2">
              <Image
                src="/window.svg"
                alt="TaskBuddy Logo"
                width={40}
                height={40}
                className=""
                priority
              />
              TaskBuddy
            </div>
            <p className="text-gray-600 text-center text-sm mb-8">Streamline your workflow and track progress effortlessly with our all-in-one task management app.</p>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className=" bg-black flex items-center justify-center gap-3 w-full  text-white px-6 py-6 rounded-3xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
              aria-label="Sign in with Google"
            >
              <Image
                src="/google.svg"
                alt="Google Logo"
                width={20}
                height={20}
                priority
              />
              <span className='text-white text-xl font-semibold'>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2   flex items-center justify-center   ">
        <Image
          src="/Screenshot 2025-02-23 at 3.34.09 PM.png"
          alt="Task Management Illustration"
          width={1000}
          height={1000}
          className="object-cover object-left rounded-lg  h-full py-20 pl-10"
          
        />
      </div>
    </div>
  );
}
