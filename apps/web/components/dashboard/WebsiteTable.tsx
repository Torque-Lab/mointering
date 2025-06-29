'use client';

import { Table, type TableRowData } from "./Table";
import { Button } from "../Button";
import { PlusIcon } from "../../ui-icons/PlusIcons";
import { useState } from "react";
import ContentModel from "../ModelToAddWebsite";

export default function WebsiteTable({ initialData }: { initialData: TableRowData[] | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<TableRowData[] | null>(initialData);

  const handleAddService = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
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
          <PlusIcon />
          Add New Service
        </Button>
      </div>
      
      {tableData ? (
        <div className="bg-[#1e293b] rounded-lg border border-[#3b4754] ml-16 p-8 min-w-fit min-h-fit">
          <Table data={tableData} />
        </div>
      ) : (
        <div className="bg-[#1e293b] rounded-lg border border-[#3b4754] ml-16 p-8 min-w-fit min-h-fit flex items-center justify-center">
          <p className="text-gray-400">No websites found. Click Add New Service to get started.</p>
        </div>
      )}
      
      <ContentModel open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
