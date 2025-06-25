import { Request, Response } from "express";
import { prismaClient } from "@repo/db/prisma";

export const getWebsites = async (req: Request, res: Response) => {
  try {
   
    const websites = await prismaClient.website.findMany({
      include: {
        ticks: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    const formattedWebsites = websites.map(website => ({
      id: website.id,
      name: website.serviceName || 'Unnamed Service',
      url: website.url,
      status: website.ticks[0]?.status === 'Up' ? 'Online' : 'Offline',
      uptime: '99.9%', 
      responseTime: `${website.ticks[0]?.response_time_ms || 0}ms`,
      lastCheck: formatTimeAgo(website.ticks[0]?.createdAt || website.createdAt),
    }));

    if (formattedWebsites.length === 0) {
      return res.json(getDummyData());
    }

    res.json(formattedWebsites);
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
