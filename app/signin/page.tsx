'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // Store the token in a cookie
      document.cookie = `firebase-token=${idToken}; path=/`;
      
      router.push('/');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-8 bg-gray-50 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-purple-500 text-4xl font-bold mb-6 flex items-center gap-2">
            <Image
              src="/window.svg"
              alt="TaskBuddy Logo"
              width={40}
              height={40}
              className=""
            />
            TaskBuddy
          </div>
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 w-full bg-white text-black px-6 py-3 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          >
            <Image
              src="/google.svg"
              alt="Google Logo"
              width={20}
              height={20}
            />
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
