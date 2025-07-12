import { useState } from "react";
import { Button } from "./Button";

interface ContentModelProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export default function ContentModel({ open, onClose, className = '' }: ContentModelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    email: '',
  });

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/add-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`} onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <CrossIcon />
        </button>

        <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Service</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <InputBox
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter service name"
              required
              className="w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Service URL
            </label>
            <InputBox
              id="url"
              type="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com/health"
              required
              className="w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Notification Email (Optional)
            </label>
            <InputBox
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Service'}
            </Button>
          </div>
        </form>
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
        className=" cursor-pointer w-5 h-5"
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