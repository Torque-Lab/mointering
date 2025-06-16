import { tree } from "next/dist/build/templates/app-page";
import { SideBarItem } from "./SidebarItem";
import { HomeIcons } from "./ui-icons/HomeIcons";
import { MenuIcons } from "./ui-icons/MenuIcon";

export function Sidebar() {
  return (
    <div className="h-screen w-72 border-r fixed left-0 top-0">
      <SideBarItem icon={<MenuIcons />} menuTrue={true} />
      <SideBarItem text={"Home"} icon={<HomeIcons />} menuTrue={false} />
      <SideBarItem text={"Home"} icon={<HomeIcons />} menuTrue={false} />
    </div>
  );
}
