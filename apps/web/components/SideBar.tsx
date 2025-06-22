import { useState } from 'react';
import { HomeIcons } from "../ui-icons/HomeIcons";
import { MenuIcons } from "../ui-icons/MenuIcons";
import { SideBarItem } from "./SideBarItem";
import { CloseIcons } from "../ui-icons/CloseIcons";
import { SettingIcons } from '../ui-icons/SettingIcons';
import { LogOutIcons } from '../ui-icons/LogoutIcons';
import { PaymentIcons } from '../ui-icons/PaymentIcons';
import { NotificationIcon } from '../ui-icons/NotificationIcon';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div 
      className={`h-screen ${isOpen ? 'overflow-y-scroll' : 'overflow-y-hidden'} fixed left-0 top-0 bg-white transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'w-72' : 'w-18'
      }`}
    >
      <div className="p-4">
        <div onClick={toggleMenu} className="cursor-pointer flex justify-end">
          {isOpen ? <CloseIcons /> : <MenuIcons />}
        </div>
      </div>
      <div className="mt-4 px-4">
        {isOpen && (
          <div className="text-[#1e293b] text-2xl font-bold mb-6 -mt-6 underline">SiteWatch</div>
          
        )}
        <SideBarItem text={isOpen ? "Home" : ""} icon={<HomeIcons />} />
        <SideBarItem text={isOpen ? "Dashboard" : ""} icon={<HomeIcons />} />
      <SideBarItem text={isOpen ? "Settings" : ""} icon={<SettingIcons />} />
      <SideBarItem text={isOpen ? "Notifications" : ""} icon={<NotificationIcon />} />
      <SideBarItem text={isOpen ? "Bills & Payments" : ""} icon={<PaymentIcons />} />
      <SideBarItem text={isOpen ? "Logout" : ""} icon={<LogOutIcons />} />
      </div>
    </div>
  );
}