import { ReactElement, ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  text?: string;
  startIcon?: ReactElement;
  children?: ReactNode;
}

const variantClasses = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};

const defaultStyle = "px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors";

export function Button({ 
  variant = "primary", 
  text, 
  startIcon, 
  children,
  className = '', 
  ...props 
}: ButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      className={`${variantClasses[variant]} ${defaultStyle} ${className}`}
      {...props}
    >
      {startIcon}
      {text || children}
    </button>
  );
}