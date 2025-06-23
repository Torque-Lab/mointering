
import React from 'react';
type StatusType = 'Online' | 'Offline';
interface TableRowData {
  id: string | number; 
  name: string;
  status: StatusType;
  uptime: string;
  responseTime: string;
  lastCheck: string;
}

interface TableProps {
  data: TableRowData[];
  onViewDetails?: (id: string | number) => void; 
}

export function Table({ data, onViewDetails }: TableProps) {
  const getStatusClass = (status: StatusType) => {
    return status === 'Online' 
      ? 'bg-green-500' 
      : 'bg-red-500';
  };

  return (
    <div className="flex align-center justify-center w-[60%] h-[57%] mt-6 ml-40 mb-12 overflow-auto scroll-smooth no-scrollbar ove rounded-lg border border-[#3b4754] bg-[#1e293b] scrollbar-thin scrollbar-thumb-[#3b4754] scrollbar-track-[#1e293b] hover:scrollbar-thumb-[#4a5a6e]">
      <table className="w-full">
        <thead>
          <tr className="bg-[#1b2127]">
            <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Name</th>
            <th className="px-4 py-3 text-left text-white w-60 text-sm font-medium leading-normal">Status</th>
            <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Uptime</th>
            <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Response Time</th>
            <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Last Check</th>
            <th className="px-4 py-3 text-left text-white w-60 text-[#9cabba] text-sm font-medium leading-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t border-t-[#3b4754] hover:bg-[#283039] transition-colors">
              <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                {row.name}
              </td>
              <td className="h-[72px] px-4 py-2 w-60">
                <button
                  className={`flex items-center justify-center rounded-full h-6 px-3 text-white text-xs font-medium ${getStatusClass(row.status)}`}
                >
                  {row.status}
                </button>
              </td>
              <td className="h-[72px] px-4 py-2 w-[400px] text-[#9cabba] text-sm font-normal leading-normal">
                {row.uptime}
              </td>
              <td className="h-[72px] px-4 py-2 w-[400px] text-[#9cabba] text-sm font-normal leading-normal">
                {row.responseTime}
              </td>
              <td className="h-[72px] px-4 py-2 w-[400px] text-[#9cabba] text-sm font-normal leading-normal">
                {row.lastCheck}
              </td>
              <td 
                className="h-[72px] px-4 py-2 w-60 text-[#9cabba] text-sm font-bold leading-normal tracking-[0.015em] cursor-pointer hover:text-white"
                onClick={() => onViewDetails && onViewDetails(row.id)}
              >
                View Details
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}