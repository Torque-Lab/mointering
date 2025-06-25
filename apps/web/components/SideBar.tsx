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
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const router = useRouter();

  return (
    <div 
      className={`h-screen ${isOpen ? 'w-64' : 'w-16'} bg-[#1c2e42] shadow-lg transition-all duration-300 ease-in-out fixed left-0 top-0 z-40 `}
    >
     
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {isOpen && (
            <div className="text-purple-600 text-xl font-bold">SiteWatch</div>
          )}
          <button 
            onClick={toggleMenu}
            className=" text-[#e5e1f1] hover:text-[#e4e3e8] focus:outline-none cursor-pointer"
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
              onClick={() => router.push('/home')}
            />
            <SideBarItem 
              text={isOpen ? "Settings" : ""} 
              icon={<SettingIcons />} 
              onClick={() => router.push('/settings')}
            />
            <SideBarItem 
              text={isOpen ? "Notifications" : ""} 
              icon={<NotificationIcon />} 
              onClick={() => router.push('/notifications')}
            />
            <SideBarItem 
              text={isOpen ? "Profile" : ""} 
              icon={<ProfileIcons />} 
              onClick={() => router.push('/profile')}
            />
            <SideBarItem 
              text={isOpen ? "Bills & Payments" : ""} 
              icon={<PaymentIcons />} 
              onClick={() => router.push('/bills')}
            />
          </ul>
        </nav>
        

        <div className="p-4 border-t border-gray-200 mb-10">
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center space-x-0.5 cursor-pointer">
              <ThemeSwitcher />
              {isOpen && <span className="text-sm text-gray-600 font-bold">Theme</span>}
            </div> */}
            {
              isOpen && (
                <SideBarItem 
                  text="Logout" 
                  icon={<LogOutIcons />} 
                  className="text-[#e65535] hover:text-[#29292b] focus:outline-none cursor-pointer"
                  onClick={() => {
                    fetch('/api/auth/logout',
                    
                    {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                  }).then(() => {
                    router.push('/sign-in');
                  })
                }}
                />
              )
            }
          </div>
        </div>

      </div>
    </div>
  );
}