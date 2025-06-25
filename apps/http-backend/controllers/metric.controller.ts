import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express";

type Status = 'Up' | 'Down';

interface WebsiteTick {
  status: Status;
  createdAt: Date;
  response_time_ms: number;
}
export const getMetrics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'Missing required query parameters: from and to' });
    }

    const metrics = await prismaClient.$queryRaw<WebsiteTick[]>`
      SELECT 
        status,
        "createdAt",
        response_time_ms
      FROM "website_tick"
      WHERE website_id = ${id}
        AND "createdAt" >= ${new Date(from as string)}
        AND "createdAt" <= ${new Date(to as string)}
      ORDER BY "createdAt" ASC
    `;

    const response = metrics.map(tick => ({
      status: tick.status,
      timestamp: tick.createdAt.toISOString(),
      duration: tick.status === 'Up' ? 0 : tick.response_time_ms 
    }));
    const res2=[
      { status: 'Up', timestamp: '2025-06-24T12:00:00Z', duration: 120 },
      { status: 'Down', timestamp: '2025-06-24T12:01:00Z', duration: 45 },
      { status: 'Up', timestamp: '2025-06-24T12:02:00Z', duration: 80 },
      { status: 'Down', timestamp: '2025-06-24T12:03:00Z', duration: 150 },
      { status: 'Up', timestamp: '2025-06-24T12:04:00Z', duration: 95 },
      { status: 'Down', timestamp: '2025-06-24T12:05:00Z', duration: 30 },
      { status: 'Up', timestamp: '2025-06-24T12:06:00Z', duration: 60 },
      { status: 'Down', timestamp: '2025-06-24T12:07:00Z', duration: 70 },
      { status: 'Up', timestamp: '2025-06-24T12:08:00Z', duration: 110 },
      { status: 'Down', timestamp: '2025-06-24T12:09:00Z', duration: 40 },
      { status: 'Up', timestamp: '2025-06-24T12:10:00Z', duration: 125 },
      { status: 'Down', timestamp: '2025-06-24T12:11:00Z', duration: 55 },
      { status: 'Up', timestamp: '2025-06-24T12:12:00Z', duration: 135 },
      { status: 'Down', timestamp: '2025-06-24T12:13:00Z', duration: 50 },
      { status: 'Up', timestamp: '2025-06-24T12:14:00Z', duration: 65 },
      { status: 'Down', timestamp: '2025-06-24T12:15:00Z', duration: 115 },
      { status: 'Up', timestamp: '2025-06-24T12:16:00Z', duration: 100 },
      { status: 'Down', timestamp: '2025-06-24T12:17:00Z', duration: 85 },
      { status: 'Up', timestamp: '2025-06-24T12:18:00Z', duration: 75 },
      { status: 'Down', timestamp: '2025-06-24T12:19:00Z', duration: 90 },
    ];

    res.json(res2);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

export const getUptimeSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const calculateUptime = async (startDate: Date) => {
      const result = await prismaClient.$queryRaw<{up: number, total: number}[]>`
        SELECT 
          COUNT(CASE WHEN status = 'Up' THEN 1 END)::int as up,
          COUNT(*)::int as total
        FROM "website_tick"
        WHERE website_id = ${id}
          AND "createdAt" >= ${startDate}
      `;
      
      const { up = 0, total = 0 } = result[0] || {};
      return total > 0 ? (up / total * 100).toFixed(1) + '%' : '100%';
    };

    const [uptime24h, uptime7d, uptime30d] = await Promise.all([
      calculateUptime(last24h),
      calculateUptime(last7d),
      calculateUptime(last30d)
    ]);

    res.json({
      last24h: uptime24h,
      last7d: uptime7d,
      last30d: uptime30d,
    });
  } catch (error) {
    console.error('Error fetching uptime summary:', error);
    res.status(500).json({ error: 'Failed to fetch uptime summary' });
  }
};