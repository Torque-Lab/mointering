import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
}

const variantClasses = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-400 text-white",
};

const defultStyle =
  "px-4 py-2 rounded-md font-light flex justify-end items-centor";
export function Button({ variant, text, startIcon, onClick }: ButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} ${defultStyle}`}
      onClick={onClick}
    >
      <div className="flex items-center pr-4 gap-x-2 ">
        {startIcon}
        {text}
      </div>
    </button>
  );
}