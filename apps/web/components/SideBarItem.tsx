import { ReactElement } from "react";

interface SideBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  icon: ReactElement;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function SideBarItem({ 
  text, 
  icon, 
  isActive = false,
  className = '',
  onClick,
  ...props 
}: SideBarItemProps) {
  return (
    <li>
      <div 
        className={`flex items-center py-2.5 px-4 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${
          isActive ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
        } ${className}`}
        onClick={onClick}
        {...props}
      >
        <div className={`flex-shrink-0 ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
          {icon}
        </div>
        {text && (
          <span className="ml-3 text-sm font-medium whitespace-nowrap">
            {text}
          </span>
        )}
      </div>
    </li>
  );
}