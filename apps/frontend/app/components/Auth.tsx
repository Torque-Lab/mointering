"use client";

import {  useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

interface AuthProps {   
  isLogin?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}
export default function Auth({ isLogin , onSuccess, onError }: AuthProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string; isError: boolean} | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
     
const endpoint = isLogin ? '/api/auth/sign-in' : '/api/auth/sign-up';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } 
      } else {
        const errorData = await response.json();
        if (onError) {
          onError(errorData.message || 'An error occurred');
        } else {
          setMessage({text: errorData.message || 'An error occurred', isError: true});
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      if (onError) {
        setMessage({text: errorMessage, isError: true});
      } else {
        setMessage({text: errorMessage, isError: true});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    if (provider === 'google') {
      window.location.href = '/api/auth/google';
    }
    if (provider === 'github') {
      window.location.href = '/api/auth/github';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
     
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
        {message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {message.text}</span>
        </div>
      )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin   ? 'Log in' : 'Create an account'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 outline-1 outline-gray-300 hover:outline-blue-500 focus-within:outline-2 focus-within:outline-blue-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
           
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-900  outline-1 outline-gray-300 hover:outline-blue-500 focus-within:outline-2 focus-within:outline-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="username" className="sr-only">
               Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  outline-1 outline-gray-300 hover:outline-blue-500 focus-within:outline-2 focus-within:outline-blue-500  focus:z-10 sm:text-sm"
              placeholder="Work Email"
            />
          </div>
          
          <div className="relative flex items-stretch w-full group  outline-1 outline-gray-200 hover:outline-blue-500 focus-within:outline-2 focus-within:outline-blue-500 rounded-md">
            <div className="relative flex-1">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className=" appearance-none rounded-l-md relative block w-full px-3 py-2 border border-r-0 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none"
                placeholder="Password"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className=" cursor-pointer inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md hover:bg-gray-100 "
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

        

          {!isLogin && (
          <div className="text-sm text-red-500">Password must be at least 8 characters long
            <p className="text-xs text-red-500">Password must contain at least one of each of followings:</p>
            <ul className="list-disc list-inside text-xs text-red-500">
              <li>[A-Z]</li>
              <li>[a-z]</li>
              <li>[0-9]</li>
              <li>[@$!%*?&#]</li>
            </ul>

          </div>
      )}
          <div className="flex items-center justify-between">
            {isLogin && (
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                'Processing...'
              ) : isLogin ? (
                'Log in'
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
            <div className="w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
       <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg></div>
              <span className="ml-1">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
          <div className="w-6 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
    <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
    </svg>
          </div>
              <span className="ml-1">GitHub</span>
            </button>
          </div>
        </div>

        <div className="text-center text-sm">
          {isLogin ? (
            <>
              Not a member yet?{' '}
              <button
                type="button"
                onClick={() => router.push('/sign-up')}
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Join
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}