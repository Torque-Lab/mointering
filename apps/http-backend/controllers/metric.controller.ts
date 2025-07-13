import { prismaClient } from "@repo/db";
import { Request, Response,NextFunction } from "express";

type Status = 'Up' | 'Down';    

export const getMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'Missing required query parameters: from and to' });
    }

    const dailyMetrics = await prismaClient.$queryRaw<{
      date: Date;
      up_count: number;
      down_count: number;
      avg_response_time: number;
      total_checks: number;
    }[]>`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(CASE WHEN status = 'Up' THEN 1 END) as up_count,
        COUNT(CASE WHEN status = 'Down' THEN 1 END) as down_count,
        COALESCE(AVG(response_time_ms), 0) as avg_response_time,
        COUNT(*) as total_checks
      FROM "website_tick"
      WHERE website_id = ${id}
        AND "createdAt" >= ${new Date(from as string)}
        AND "createdAt" <= ${new Date(to as string)}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `;

    const response = dailyMetrics.map(day => {
      const upCount = Number(day.up_count);
      const downCount = Number(day.down_count);
      const totalChecks = Number(day.total_checks);
      const avgResponseTime = Number(day.avg_response_time);
      
      return {
        date: day.date.toISOString().split('T')[0],
        uptime: ((upCount / totalChecks) * 100).toFixed(2) + '%',
        avgResponseTime: Math.round(avgResponseTime),
        upCount: upCount,
        downCount: downCount,
        totalChecks: totalChecks
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

export const getUptimeSummary = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const calculateUptime = async (startDate: Date) => {
      const result = await prismaClient.$queryRaw<{up: bigint, total: bigint}[]>`
        SELECT 
          COUNT(CASE WHEN status = 'Up' THEN 1 END) as up,
          COUNT(*) as total
        FROM "website_tick"
        WHERE website_id = ${id}
          AND "createdAt" >= ${startDate}
      `;
      
      const { up = BigInt(0), total = BigInt(0) } = result[0] || {};
      const upNum = Number(up);
      const totalNum = Number(total);
      return totalNum > 0 ? (upNum / totalNum * 100).toFixed(1) + '%' : '100%';
    };

    const [uptime24h, uptime7d, uptime30d] = await Promise.all([
      calculateUptime(last24h),
      calculateUptime(last7d),
      calculateUptime(last30d)
    ]);

    res.status(200).json({
      last24h: uptime24h,
      last7d: uptime7d,
      last30d: uptime30d,
    });
  } catch (error) {
    console.error('Error fetching uptime summary:', error);
    res.status(500).json({ error: 'Failed to fetch uptime summary' });
  }
};