"use client"
import { Button } from "../../components/Button";
import UptimeChart, { Status, UptimeData } from "../../components/UptimeChart";
import { Table } from "../../components/dashboard/Table";
import { PlusIcon } from "../../ui-icons/PlusIcons";
import { Sidebar } from "../../components/SideBar";
import { useState } from "react";
import { ContentModel } from "../../components/ModelToAddWebsite";

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
    {
      id: 6,
      name: 'Main Website',
      status: 'Online' as const,
      uptime: '100%',
      responseTime: '250ms',
      lastCheck: '2 minutes ago'
    },
    {
      id: 7,
      name: 'API Service',
      status: 'Online' as const,
      uptime: '99.98%',
      responseTime: '180ms',
      lastCheck: '1 minute ago'
    },
    {
      id: 8,
      name: 'API Service',
      status: 'Online' as const,
      uptime: '99.98%',
      responseTime: '180ms',
      lastCheck: '1 minute ago'
    },
    {
      id: 9,
      name: 'API Service',
      status: 'Online' as const,
      uptime: '99.98%',
      responseTime: '180ms',
      lastCheck: '1 minute ago'
    },
    {
      id: 10,
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

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#182636]">
      <Sidebar />
      
      <div className="flex-1 ml-18 transition-all duration-300">
        <div className="p-6" >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-white text-3xl font-bold">Overview</h1>
              <p className="text-[#9cabba] text-sm mt-1">Monitor your services and websites</p>
            </div>
            <Button 
              variant="primary" 
              startIcon={<PlusIcon />} 
              text="Add Services" 
              onClick={handleOpen} 
              className="ml-auto"
            />
          </div>
          
          <div className="bg-[#1E293B] rounded-lg p-6">
            <Table data={tableData} onViewDetails={handleViewDetails} />
          </div>
        </div>
      </div>
      
      <ContentModel open={open} onClose={handleClose} />
    </div>
  );
}
