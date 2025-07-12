"use client";

import { useRef, useState } from "react";

export default function ForgotPasswordPage() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const [showInstructions, setShowInstructions] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const username = usernameRef.current?.value;
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        const data = await response.json();
        if (data.success) {
            setShowInstructions(true);  
        }else{
            alert("fail to intiate password reset")
        }
    }catch(error){
        console.error("Error intiating password reset:", error);
        alert("fail to intiate password reset")
    }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
                {!showInstructions ? (
                    <>
                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Forgot your password?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter your email below and we will send you instructions to reset your password.
                            </p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="email-address" className="sr-only">
                                        Email address
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        ref={usernameRef}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Reset password
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Check your email for instructions to reset your password.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
