
import { useRouter } from 'next/navigation';
import React from 'react';

export type StatusType = 'Online' | 'Offline';

export interface TableRowData {
  id: string | number; 
  name: string;
  status: StatusType;
  uptime: string;
  responseTime: string;
  lastCheck: string;
  url?: string;
}

interface TableProps {
  data: TableRowData[];
}

export function Table({ data }: TableProps) {
  const router = useRouter();
  
  const getStatusClass = (status: StatusType) => {
    return status === 'Online' 
      ? 'bg-green-500' 
      : 'bg-red-500';
  };
  
  const handleRowClick = (id: string | number) => {
    router.push(`/service/${id}`);
  };

  return (
    <div className="w-full p-2 md:p-6 overflow-x-auto ">
      <div className="min-w-[80%] rounded-lg border border-[#3b4754] bg-[#1e293b] overflow-x-scroll no-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1b2127]">
              <th className="px-4 py-3 text-left text-white text-sm font-medium whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium whitespace-nowrap table-cell">Uptime</th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium whitespace-nowrap table-cell">Response Time</th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium whitespace-nowrap table-cell">Last Check</th>
              <th className="px-4 py-3 text-left text-white text-sm font-medium whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr 
                key={row.id} 
                className="border-t border-t-[#3b4754] hover:bg-[#283039] transition-colors cursor-pointer"
                onClick={() => handleRowClick(row.id)}
              >
                <td className="px-4 py-4 text-white text-sm font-normal whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-4 py-4">
                  <button
                    className={`flex items-center justify-center rounded-full h-6 px-3 text-white text-xs font-medium ${getStatusClass(row.status)}`}
                  >
                    {row.status}
                  </button>
                </td>
                <td className="px-4 py-4 text-[#9cabba] text-sm font-normal table-cell">
                  {row.uptime}
                </td>
                <td className="px-4 py-4 text-[#9cabba] text-sm font-normal table-cell">
                  {row.responseTime}
                </td>
                <td className="px-4 py-4 text-[#9cabba] text-sm font-normal table-cell">
                  {row.lastCheck}
                </td>
                <td 
                onClick={() => handleRowClick(row.id)}
                  className="px-4 py-4 text-[#9cabba] text-sm font-bold hover:text-white whitespace-nowrap"
                >
                  View Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}