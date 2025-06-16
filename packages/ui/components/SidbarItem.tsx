import { ReactElement } from "react";

interface SideBarItemProps {
  text?: string;
  icon: ReactElement;
  menuTrue?: boolean;
  onClick?: () => void;
}
export function SideBarItem({
  text,
  icon,
  menuTrue,
  onClick,
}: SideBarItemProps) {
  return (
    <>
      {menuTrue && (
        <div
          className="flex justify-end cursor-pointer w-full mb-2"
          onClick={onClick}
        >
          {icon}
        </div>
      )}
      {!menuTrue && (
        <div className="flex gap-2 justify-center items-center">
          {icon}
          {text}
        </div>
      )}
    </>
  );
}
