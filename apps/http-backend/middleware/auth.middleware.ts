import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '@repo/db';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : undefined;
    const access_token = req.cookies.access_token || tokenFromHeader;
    if (!access_token) {
       res.status(401).json({ error: 'Invalid token' });
       return;
    }
 
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS || 'z78h98yryvei7ritgfb67385vg7667') as { payload1: { userId: string, timeId: string, tokenId: string, issuedAt: number } };

    if(!decoded?.payload1?.userId) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    
    const userId = decoded.payload1.userId;
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
      res.status(401).json({ error: 'Invalid token' });
      return;
  }
};

export const csurfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sentToken = req.headers['x-csurf-token'] || req.body.csrfToken;
  const storedToken = req.cookies['csurf_token'];
  
  if (sentToken !== storedToken) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }
  next();
};