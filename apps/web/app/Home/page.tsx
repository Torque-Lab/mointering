"use client"
import { Button } from "../../components/Button";
import { Table, type TableRowData } from "../../components/dashboard/Table";
import { PlusIcon } from "../../ui-icons/PlusIcons";
import { Sidebar } from "../../components/SideBar";
import { useState, useEffect } from "react";
import ContentModel from "../../components/ModelToAddWebsite";

export default function Home() {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await fetch('/api/websites', {
          credentials: 'include',
          next: { revalidate: 300} 
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch websites');
        }
        
        const data = await response.json();
        setTableData(data);
      } catch (err) {
        console.error('Error fetching websites:', err);
        setError('Failed to load website data. Using sample data instead.');
        // Fallback to sample data
        setTableData([
          {
            id: 1,
            name: 'Main Website',
            status: 'Online',
            uptime: '100%',
            responseTime: '250ms',
            lastCheck: '2 minutes ago',
            url: 'https://example.com'
          },
          {
            id: 2,
            name: 'API Service',
            status: 'Online',
            uptime: '99.98%',
            responseTime: '180ms',
            lastCheck: '1 minute ago',
            url: 'https://api.example.com'
          },
          {
            id: 3,
            name: 'Database',
            status: 'Online',
            uptime: '99.99%',
            responseTime: '50ms',
            lastCheck: '5 minutes ago',
            url: 'https://db.example.com'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const handleAddService = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#182636]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#182636] min-w-fit">
      <Sidebar />
      <div className="flex-1 p-8 text-white">
        <div className="flex justify-between items-center mb-8 ml-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Monitor your services and websites</p>
          </div>
<Button 
            variant="primary"
            onClick={handleAddService}
            className="whitespace-nowrap"
          >
            <PlusIcon  />
            Add New Service
          </Button>
        </div>
        
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded" role="alert">
            <p className="font-medium ml-16">{error}</p>
          </div>
        )}
        
        <div className="bg-[#1e293b] rounded-lg border border-[#3b4754] ml-16 p-8 min-w-fit min-h-fit">
          <Table data={tableData} />
        </div>
      </div>
<ContentModel open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
