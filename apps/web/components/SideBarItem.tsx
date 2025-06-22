import { ReactElement } from "react";

interface SideBarItemProps {
  text?: string;
  icon: ReactElement;
  onClick?: () => void;
}

export function SideBarItem({ text, icon, onClick }: SideBarItemProps) {
  return (
    <div 
      className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mb-2"
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      {text && <span className="ml-3 whitespace-nowrap">{text}</span>}
    </div>
  );
}