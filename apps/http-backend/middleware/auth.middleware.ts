import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '@repo/db/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       res.status(401).json({ error: 'Authentication required' });
       return;
    }

    const access_token = authHeader.split(' ')[1] || req.cookies.access_token;
    if (!access_token) {
       res.status(401).json({ error: 'Invalid token' });
       return;
    }
 
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS || 'your-secret-key') as { userId: string };


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

    req.user = user.id;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
      res.status(401).json({ error: 'Invalid token' });
      return;
  }
};