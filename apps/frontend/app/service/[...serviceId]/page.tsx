import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import dynamic from 'next/dynamic';
import { UptimeData } from "../../types/uptime";
import UptimeChart from "../../components/UptimeChart"; 

import { NEXT_PUBLIC_URL } from "../../lib/config";
interface Props {
  params: {
    serviceId: string[];
  };
  searchParams?: {
    days?: string;
  };
}

interface UptimeSummary {
  last24h: string;
  last7d: string;
  last30d: string;
}

async function fetchMetrics(serviceId: string, from: Date, to: Date): Promise<UptimeData[]> {
  const fromISO = from.toISOString();
  const toISO = to.toISOString();
  
  const res = await fetch(
    `${NEXT_PUBLIC_URL}/api/metrics/${serviceId}?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`,
    { 
      credentials: 'include',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch metrics');
  }
await new Promise(resolve => setTimeout(resolve, 2000));
  return res.json();
}

async function fetchUptimeSummary(serviceId: string): Promise<UptimeSummary> {
  const res = await fetch(
    `${NEXT_PUBLIC_URL}/api/metrics/${serviceId}/uptime-summary`,
    { 
      credentials: 'include',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch uptime summary');
  }

  return res.json();
}

const getDateRange = (days: number) => ({
  from: subDays(new Date(), days - 1),
  to: new Date(),
});

export default async function ServicePage({ params, searchParams }: Props) {
  const serviceId = Array.isArray(params.serviceId) 
    ? params.serviceId[0] 
    : await params.serviceId || '';
    
  if (!serviceId) {
    throw new Error('Service ID is required');
  }
  
  const days = await searchParams?.days ? Number(searchParams!.days) : 7;
  const dateRange = getDateRange(days);
  
  const [metrics] = await Promise.all([
    fetchMetrics(serviceId, dateRange.from, dateRange.to),
  ]);
  
  const chartData = metrics.map(item => ({
    status: item.status,
    timestamp: item.timestamp,
    duration: item.duration
  }));
  
  const filteredData = chartData.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= dateRange.from && itemDate <= dateRange.to;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Service: {serviceId}</h1>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-lg font-medium text-white">Date Range:</h2>
            {[7, 14, 30, 90].map((daysOption) => (
              <a
                key={daysOption}
                href={`?days=${daysOption}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  days === daysOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Last {daysOption} days
              </a>
            ))}
            <div className="ml-auto text-sm text-gray-400">
              {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        {/* Uptime Chart */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Uptime Overview</h2>
          <div className="h-64">
            {
              filteredData.length > 0 ? (
                <UptimeChart 
                  data={filteredData || []} 
                  dateRange={{
                    from: startOfDay(dateRange.from),
                to: endOfDay(dateRange.to)
              }}
            />    
              ) : (
                <p className="text-gray-400">No data available for the selected date range</p>
              )
            }
          </div>
        </div>

        {/* Additional metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Uptime (24h)</h3>
            <p className="text-3xl font-bold text-green-500">99.9%</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Response Time</h3>
            <p className="text-3xl font-bold text-blue-400">142ms</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Last Incident</h3>
            <p className="text-3xl font-bold text-red-400">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}