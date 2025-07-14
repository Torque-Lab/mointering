import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { prismaClient } from '@repo/db';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import { setAuthCookie } from './auth.controller';
import { generateTimeId } from './auth.controller';
import bcrypt from 'bcrypt';



passport.use(new GoogleStrategy(
  { 
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.NEXT_PUBLIC_URL + '/api/auth/google/callback',
  },
  async (_accessToken,_refreshToken, profile: Profile, done) => {
    try {
        const email=profile.emails![0]!.value ?? '';

      let googleUser = await prismaClient.user.findUnique({
        where: {username: email}
      });

      if (!googleUser) {
        googleUser = await prismaClient.user.create({
          data: {
            id:profile.id,
            username: email,
            name: profile.displayName,
            password:  bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10)
          },
        });
      }

      done(null, googleUser);
    } catch (err) {
      console.error(err);
      done(err as Error, false);
    }
  }
));

export default passport;


interface googleUser{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string | null;
    image: string | null;
    username: string;
    password: string;
}
export const startGoogleAuth = (): RequestHandler => {
    return passport.authenticate('google', { scope: ['profile', 'email'] })
}


export const googleCallbackMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: Error, user: googleUser) => {
    if (err || !user) {
      console.error('Google OAuth error:', err);
       res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=google`);
       return;
    }
    req.user = user;
    next();
  })(req, res, next);
};
export const handleGoogleCallback = async(req: Request, res: Response): Promise<void> => {
  const user = req.user as googleUser;

  if (!user) {
    res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=google`);
    return;
  }

  const payload1 = {
    timeId: generateTimeId(),
    userId: user.id,
    tokenId: crypto.randomUUID(),
    issuedAt: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex')
  };

  const payload2 = {
    timeId: generateTimeId(),
    userId: user.id,
    tokenId: crypto.randomUUID(),
    issuedAt: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex')
  };

  const access_token = jwt.sign({ payload1 }, process.env.JWT_SECRET_ACCESS!);
  const refresh_token = jwt.sign({ payload2 }, process.env.JWT_SECRET_REFRESH!);

  setAuthCookie(res, access_token, "access_token", 60 * 60 * 1000);
  setAuthCookie(res, refresh_token, "refresh_token", 60 * 60 * 1000 * 24 * 7);

  res.redirect(`${process.env.NEXT_PUBLIC_URL }/home` || 'http://localhost:3000/home');
  return;
};
