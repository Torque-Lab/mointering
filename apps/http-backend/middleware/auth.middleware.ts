import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '@repo/db';

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
 
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS || 'z78h98yryvei7ritgfb67385vg7667') as { userId: string };


    if(!decoded.userId) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.userId },
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