import { ButtonHTMLAttributes, forwardRef, ReactElement, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'primary' | 'secondary';
  text?: string;
  startIcon?: ReactElement;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className = '',
    variant = 'default',
    text,
    startIcon,
    children,
    type = 'button',
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 gap-2';
    
    const variants = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      primary: 'bg-purple-600 text-white hover:bg-purple-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    };

    return (
      <button
        type={type}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      >
        {startIcon}
        {text || children}
      </button>
    );
  }
);

Button.displayName = 'Button';
