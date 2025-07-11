import { Request, Response } from "express";
import { prismaClient } from "@repo/db";
import { WebsiteStatus} from "@repo/db"
import { WebsiteTick } from "@repo/db";

export const getWebsites = async (req: Request, res: Response) => {
  const userId=req.userId!
  try {
    const websites = await prismaClient.website.findMany({
      where: {
        user_id: userId,
      },
      include: {
        ticks: {  
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    const calculateUptime = async (websiteId: string) => {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const result = await prismaClient.$queryRaw<{up: number, total: number}[]>`
        SELECT 
          COUNT(CASE WHEN status = ${WebsiteStatus.Up} THEN 1 END)::int as up,
          COUNT(*)::int as total
        FROM "website_tick"
        WHERE website_id = ${websiteId}
          AND "createdAt" >= ${twentyFourHoursAgo}
      `;
      
      const { up = 0, total = 0 } = result[0] || {};
      return total > 0 ? (up / total * 100).toFixed(1) + '%' : '100%';
    };
    interface Website {
      id: string;
      serviceName: string;
      url: string;
      ticks: WebsiteTick[];
      createdAt: Date;
    }   

    const formattedWebsites = await Promise.all(
      websites.map(async (website:Website) => {
        const latestTick = website.ticks[0]; 
        return {
          id: website.id,
          name: website.serviceName || 'Unnamed Service',
          url: website.url,
          status: latestTick?.status === WebsiteStatus.Up ? 'Online' : 'Offline',
          uptime: await calculateUptime(website.id), 
          responseTime: `${latestTick?.response_time_ms || 0}ms`,
          lastCheck: formatTimeAgo(latestTick?.createdAt || website.createdAt),
        };
      })
    );
    

    if (formattedWebsites.length === 0) {
      return res.status(200).json(getDummyData());
    }

    res.status(200).json(formattedWebsites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.json(getDummyData());
  }
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.round(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function getDummyData() {
  return [
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
    },
    {
      id: 4,
      name: 'Authentication',
      status: 'Offline',
      uptime: '99.5%',
      responseTime: '300ms',
      lastCheck: '10 minutes ago',
      url: 'https://auth.example.com'
    },
    {
      id: 5,
      name: 'CDN',
      status: 'Online',
      uptime: '99.95%',
      responseTime: '120ms',
      lastCheck: '30 seconds ago',
      url: 'https://cdn.example.com'
    }
  ];
}
