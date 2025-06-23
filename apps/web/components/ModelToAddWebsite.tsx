import { useState } from "react";
import { Button } from "./Button";

interface modelProps {
  open: boolean;
  onClose: () => void;
}
export function ContentModel({ open, onClose }: modelProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <CrossIcon />
            </button>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Add New Service</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <InputBox 
                  id="url"
                  placeholder="https://example.com/health" 
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email to notify
                </label>
                <InputBox 
                  id="email"
                  type="email"
                  placeholder="your@email.com" 
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                text="Cancel" 
                onClick={onClose}
              />
              <Button 
                variant="primary" 
                text="Add Service"
                onClick={() => {
                
                  onClose();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  label?: string;
  className?: string;
}

export function InputBox({ 
  placeholder, 
  onChange, 
  className = '',
  type = 'text',
  id,
  ...props 
}: InputBoxProps) {
  return (
    <div className="w-full">
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

export function CrossIcon() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-4 cursor-pointer bg-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </>
  );
}