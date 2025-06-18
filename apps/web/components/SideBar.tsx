import { HomeIcons } from "../ui-icons/HomeIcons";
import { MenuIcons } from "../ui-icons/MenuIcons";
import { SideBarItem } from "./SidebarItem";


export function Sidebar() {
  return (
    <div className="h-screen w-72 border-r fixed left-0 top-0">
      <SideBarItem icon={<MenuIcons />} menuTrue={true} />
      <SideBarItem text={"Home"} icon={<HomeIcons />} menuTrue={false} />
      <SideBarItem text={"Home"} icon={<HomeIcons />} menuTrue={false} />
    </div>
  );
}