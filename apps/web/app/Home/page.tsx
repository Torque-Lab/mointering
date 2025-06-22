"use client"
import { Button } from "../../components/Button";
import UptimeChart, { Status, UptimeData } from "../../components/UptimeChart";
import { Table } from "../../components/dashboard/Table";
import { PlusIcon } from "../../ui-icons/PlusIcons";
import { Sidebar } from "../../components/SideBar";

export default function Home() {
  const data: UptimeData[] = [
    { status: "Up" as Status, date: "2025-06-10", duration: "1440" },
    { status: "Down" as Status, date: "2025-06-11", duration: "10" },
    { status: "Up" as Status, date: "2025-06-12", duration: "1430" },
    // more objects...
  ];

  const tableData = [
    {
      id: 1,
      name: 'Main Website',
      status: 'Online' as const,
      uptime: '100%',
      responseTime: '250ms',
      lastCheck: '2 minutes ago'
    },
    {
      id: 2,
      name: 'API Service',
      status: 'Online' as const,
      uptime: '99.98%',
      responseTime: '180ms',
      lastCheck: '1 minute ago'
    },
    {
      id: 3,
      name: 'API Service',
      status: 'Online' as const,
      uptime: '99.98%',
      responseTime: '180ms',
      lastCheck: '1 minute ago'
    },
    {
      id: 4,
      name: 'API Service',
      status: 'Online' as const,
      uptime: '99.98%',
      responseTime: '180ms',
      lastCheck: '1 minute ago'
    },
    {
      id: 5,
      name: 'API Service',
      status: 'Offline' as const,
      uptime: '99.98%',
      responseTime: '180ms',
      lastCheck: '1 minute ago'
    },
    // Add more rows as needed
  ];
  const handleViewDetails = (id: string | number) => {
    console.log('View details for:', id);
    // Handle view details action
  };

  return (
    <div className="flex flex-col  bg-[#3b4754] justify-end h-screen">
      <Sidebar/>
       <div className="flex justify-end mr-4 -ml-10 -mt-10">
      <Button variant="primary" startIcon={<PlusIcon />} text={"Add website"} />
    </div>

      <div className="justify-between items-center w-full h-[80%]">
      <div className="flex flex-wrap justify-between gap-3 p-4 ml-44 -mt-10">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Overview</p>
                <p className="text-[#9cabba] text-sm font-normal leading-normal">Monitor your services and websites</p>
              </div>
            </div>
      <Table data={tableData} onViewDetails={handleViewDetails}/>
      </div>
   
   

  
      {/* <div className="flex ">
        <UptimeChart uptimeData={data} />

        <div className="bg-red  border-solid h-5 w-30 border-amber-400  ">
          {" "}
          hi{" "}
        </div> */}
      {/* </div> */}
    </div>
  );
}
