'use client'; 
import { useState } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { UptimeData } from '../types/uptime';



export interface UptimeChartProps {
  data: UptimeData[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

const statusClasses = {
  Up: "bg-green-600 hover:bg-green-600",
  Down: "bg-red-600 hover:bg-red-600",
  Unknown: "bg-gray-300 hover:bg-gray-400",
};

export default function UptimeChart({ data, dateRange }: UptimeChartProps) {


  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    x: number;
    y: number;
  } | null>(null);

  // Filter data based on the provided date range
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.timestamp);
    return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to });
  });

  const handleBarHover = (e: React.MouseEvent | React.TouchEvent, item: UptimeData) => {
    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      // Handle touch events
      if (!e.touches || e.touches.length === 0) return;
      clientX = e.touches[0]!.clientX;
      clientY = e.touches[0]!.clientY;
    } else {
      // Handle mouse events
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    setTooltip({
      visible: true,
      content: `Status: ${item.status}\nDate: ${format(new Date(item.timestamp), 'PPpp')}\n${
        item.status !== 'Up' ? `Down for: ${item.duration} min` : ''
      }`,
      x: clientX,
      y: clientY - 50,
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-64 p-4 bg-gray-800 rounded-lg overflow-x-auto no-scrollbar">
        <div 
          className="flex items-end h-full" 
          style={{ minWidth: `${Math.max(800, filteredData.length * 20)}px` }}
        >
          {filteredData.length > 0 ? (
          filteredData.map((item, idx) => (
            <div
              key={`${item.timestamp}-${idx}`}
              className={`w-3 mx-[2px] rounded-t-sm transition-all cursor-pointer ${
                statusClasses[item.status]
              }`}
              style={{
                height: item.status === 'Up' ? '100%' : `${Math.min(100, item.duration)}%`,
                minHeight: '4px',
              }}
              onMouseEnter={(e) => handleBarHover(e, item)}
              onMouseLeave={() => setTooltip(null)}
              onTouchStart={(e) => handleBarHover(e, item)}
              onTouchEnd={() => setTooltip(null)}
            />
          ))
        ) : (
          <div className="w-full text-center text-gray-400">
            No data available for the selected date range
          </div>
        )}
      </div>
</div>
      { tooltip?.visible && tooltip?.x !== undefined && tooltip?.y !== undefined && tooltip?.content !== undefined && (
        <div
          className="fixed bg-gray-900 text-white text-xs p-2 rounded shadow-lg z-50 whitespace-pre-line pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip?.content}
        </div>
      )}
    </div>
  );
}