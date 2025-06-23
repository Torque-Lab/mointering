import { useState } from 'react';
import { HomeIcons } from "../ui-icons/HomeIcons";
import { MenuIcons } from "../ui-icons/MenuIcons";
import { SideBarItem } from "./SideBarItem";
import { CloseIcons } from "../ui-icons/CloseIcons";
import { SettingIcons } from '../ui-icons/SettingIcons';
import { LogOutIcons } from '../ui-icons/LogoutIcons';
import { PaymentIcons } from '../ui-icons/PaymentIcons';
import { NotificationIcon } from '../ui-icons/NotificationIcon';
import { ProfileIcons } from '../ui-icons/ProfileIcons';
import { ThemeSwitcher } from './theme-switcher';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div 
      className={`h-screen ${isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out fixed left-0 top-0 z-40`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {isOpen && (
            <div className="text-purple-600 text-xl font-bold">SiteWatch</div>
          )}
          <button 
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
          >
            {isOpen ? <CloseIcons /> : <MenuIcons />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <SideBarItem 
              text={isOpen ? "Dashboard" : ""} 
              icon={<HomeIcons />} 
              isActive={true}
            />
            <SideBarItem 
              text={isOpen ? "Settings" : ""} 
              icon={<SettingIcons />} 
            />
            <SideBarItem 
              text={isOpen ? "Notifications" : ""} 
              icon={<NotificationIcon />} 
            />
            <SideBarItem 
              text={isOpen ? "Profile" : ""} 
              icon={<ProfileIcons />} 
            />
            <SideBarItem 
              text={isOpen ? "Bills & Payments" : ""} 
              icon={<PaymentIcons />} 
            />
          </ul>
        </nav>
        

        <div className="p-4 border-t border-gray-200 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-0.5 cursor-pointer">
              <ThemeSwitcher />
              {isOpen && <span className="text-sm text-gray-600 font-bold">Theme</span>}
            </div>
            {
              isOpen && (
                <SideBarItem 
                  text="Logout" 
                  icon={<LogOutIcons />} 
                  className="text-red-600 hover:bg-red-50"
                />
              )
            }
          </div>
        </div>

      </div>
    </div>
  );
}