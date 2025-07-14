import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { UptimeData } from "../../types/uptime";
import UptimeChart from "../../components/UptimeChart"; 
import { NEXT_PUBLIC_URL } from "../../lib/config";

interface PageProps {
  params: Promise<{ serviceId: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
// interface UptimeSummary {
//   last24h: string;
//   last7d: string;
//   last30d: string;
// }

async function fetchMetrics(serviceId: string, from: Date, to: Date): Promise<UptimeData[] | null> {
  const fromISO = from.toISOString();
  const toISO = to.toISOString();
  
  try {
    const res = await fetch(
      `${NEXT_PUBLIC_URL}/api/metrics/${serviceId}?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`,
      { 
        credentials: 'include',
        next: { revalidate: 300 } // Revalidate every 5 minutes
    }
  );

    if (!res.ok) {
      console.error('Failed to fetch metrics:', res.status, res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }
}

// async function fetchUptimeSummary(serviceId: string): Promise<UptimeSummary> {
//   const res = await fetch(
//     `${NEXT_PUBLIC_URL}/api/metrics/${serviceId}/uptime-summary`,
//     { 
//       credentials: 'include',
//       next: { revalidate: 300 } // Revalidate every 5 minutes
//     }
//   );

//   if (!res.ok) {
//     throw new Error('Failed to fetch uptime summary');
//   }

//   return res.json();
// }

const getDateRange = (days: number) => ({
  from: subDays(new Date(), days - 1),
  to: new Date(),
});

export default async function ServicePage(props: PageProps) {
  const resolvedParams = await props.params;
  const resolvedSearchParams = props.searchParams ? await props.searchParams : undefined;

  const serviceId = resolvedParams?.serviceId?.[0] || '';
  if (!serviceId) {
    throw new Error('Service ID is required');
  }

  const daysParam = resolvedSearchParams?.days;
  const days = typeof daysParam === 'string' ? Number(daysParam) : 7;

  const dateRange = getDateRange(days);
  const metrics = await fetchMetrics(serviceId, dateRange.from, dateRange.to);

  if (metrics === null) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Service: {serviceId}</h1>
          <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Service Unavailable</h2>
            <p>We&apos;re currently unable to fetch metrics data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
  

  type MetricsResponse = Array<{
    date: string;
    uptime: string | number;
    avgResponseTime: number;
    upCount: number;
    downCount: number;
    totalChecks: number;
  }>;

  const metricsDataTyped = metrics as unknown as MetricsResponse;

  const chartData = metricsDataTyped.map(day => ({
    date: day.date,
    uptime: typeof day.uptime === 'string' 
      ? parseFloat(day.uptime.replace('%', '')) 
      : day.uptime,
    avgResponseTime: day.avgResponseTime,
    upCount: day.upCount,
    downCount: day.downCount,
    totalChecks: day.totalChecks
  }));
  
  // Filter data by date range
  const filteredData = chartData.filter(day => {
    const dayDate = new Date(day.date);
    return dayDate >= dateRange.from && dayDate <= dateRange.to;
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