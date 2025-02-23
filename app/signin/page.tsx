
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
    <div className="max-h-screen h-screen flex bg-[#FFF9F9] overflow-hidden ">
      <div className="max-w-[403.9px] flex items-center justify-center m-12 ">
        <div className="p-8 rounded-lg  w-full max-w-md">
          <div className="flex flex-col items-left space-y-6">
          <div className='flex flex-col gap-2'>
            <div className="text-[#7B1984] font-ur text-2xl font-semibold flex items-center gap-2">
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
            <p className="text-gray-600  text-xs ">Streamline your workflow and track progress effortlessly with our all-in-one task management app.</p> 
          </div> 
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className=" bg-black flex items-center justify-center gap-3 w-full  text-white px-2 py-4 rounded-3xl  border border-gray-200"
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
      <div className=" hidden md:block max-w-[834.3681640625] relative top-8 left-10  aspect-square">
        <div className='h-full aspect-square border-2  border-[#7B1984] rounded-full opacity-25'>
        <div className=" absolute top-0 mt-12 ml-12 w-2/3  aspect-square rounded-full border-2 border-[#7B1984] ">
        <div className='absolute top-0 mt-20   ml-12  h-2/3  aspect-square rounded-full border-2 border-[#7B1984]'>
          </div></div>
        {/* <div className="absolute w-[800px] h-[800px] rounded-full border-2 border-[#7B1984] opacity-40 transform -translate-x-20 -translate-y-4"></div>  */}
        </div>
            <Image
          src="/Screenshot 2025-02-24 at 12.41.46 AM.png"
          alt="Task Management Illustration"
          width={1000}
          height={1000}
          className=" absolute top-0 object-cover object-left rounded-xl shadow-md  h-full pt-10 pb-20  ml-32"
          
        />
      </div>
    </div> 
  );
}
