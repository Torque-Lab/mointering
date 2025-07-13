'use client'; 
import { useState } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { UptimeData } from '../types/uptime';

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

export interface UptimeChartProps {
  data: UptimeData[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

const getStatusClass = (uptime: number | string): string => {
  const uptimeValue = typeof uptime === 'string' ? parseFloat(uptime) : uptime;
  if (isNaN(uptimeValue)) return "bg-gray-400 hover:bg-gray-500";
  if (uptimeValue >= 99.9) return "bg-green-600 hover:bg-green-700";
  if (uptimeValue >= 99) return "bg-yellow-500 hover:bg-yellow-600";
  return "bg-red-600 hover:bg-red-700";
};

export default function UptimeChart({ data, dateRange }: UptimeChartProps) {


  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const filteredData = data.filter(day => {
    const dayDate = new Date(day.date);
    return isWithinInterval(dayDate, { start: dateRange.from, end: dateRange.to });
  });

  const handleBarHover = (e: React.MouseEvent | React.TouchEvent, day: UptimeData) => {
    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      if (!e.touches || e.touches.length === 0) return;
      clientX = e.touches[0]?.clientX ?? 0;
      clientY = e.touches[0]?.clientY ?? 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const date = new Date(day.date);
    const formattedDate = format(date, 'PP');
    const uptimeValue = typeof day.uptime === 'number' ? day.uptime : parseFloat(day.uptime);
    
    setTooltip({
      visible: true,
      content: [
        `Date: ${formattedDate}`,
        `Uptime: ${uptimeValue.toFixed(2)}%`,
        `Up: ${day.upCount} checks`,
        `Down: ${day.downCount} checks`,
        `Avg Response: ${day.avgResponseTime}ms`
      ].join('\n'),
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
            filteredData.map((day, idx) => {
              const uptimeValue = typeof day.uptime === 'number' ? day.uptime : parseFloat(day.uptime);
              const height = Math.max(4, uptimeValue);
              
              return (
                <div
                  key={`${day.date}-${idx}`}
                  className={`w-3 mx-[2px] rounded-t-sm transition-all cursor-pointer ${getStatusClass(uptimeValue)}`}
                  style={{
                    height: `${height}%`,
                    minHeight: '4px',
                  }}
                  onMouseEnter={(e) => handleBarHover(e, day)}
                  onMouseLeave={() => setTooltip(null)}
                  onTouchStart={(e) => handleBarHover(e, day)}
                  onTouchEnd={() => setTooltip(null)}
                  title={`${day.date}: ${uptimeValue.toFixed(2)}% uptime`}
                />
              );
            })
          ) : (
            <div className="w-full text-center text-gray-400">
              No data available for the selected date range
            </div>
          )}
        </div>
      </div>
      {tooltip && tooltip.visible && (
        <div
          className="fixed bg-gray-900 text-white text-xs p-2 rounded shadow-lg z-50 whitespace-pre-line pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}