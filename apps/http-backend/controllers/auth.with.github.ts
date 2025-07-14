import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github';
import { prismaClient } from '@repo/db';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import { setAuthCookie, generateTimeId } from './auth.controller';
import bcrypt from 'bcrypt';

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.NEXT_PUBLIC_URL + '/api/auth/github/callback',
  },
  async (_access_token, _refresh_token, profile: Profile, done) => {
    try {
      const email = profile?.emails?.[0]?.value;

      if (!email) {
        console.error('No email in GitHub profile — aborting user creation.');
        return done(null, false, { message: 'Email not found in GitHub profile' });
      }

      const dbId = `github-${profile.id}`;
      let githubUser = await prismaClient.user.findUnique({
        where: { id: dbId }
      });

      if (!githubUser) {
        githubUser = await prismaClient.user.create({
          data: {
            id: dbId,
            username: email,
            name: profile?.displayName ?? '',
            password: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10)
          },
        });
      }

      done(null, githubUser);
    } catch (err) {
      console.error('Error in GitHub strategy:', err);
      done(err as Error, false);
    }
  }
));

export default passport;

interface githubUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  image: string | null;
  username: string;
  password: string;
}

export const startGithubAuth = (): RequestHandler => {
  return passport.authenticate('github', { scope: ['user:email'] });
};
export const githubCallbackMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('github', { session: false }, (err: Error, user: githubUser) => {
    if (err || !user) {
      console.error('GitHub OAuth error:', err);
       res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=github`);
       return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const handleGithubCallback = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as githubUser;

  if (!user) {
    console.error('No user in request after GitHub auth');
    res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=github`);
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

  setAuthCookie(res, access_token, 'access_token', 60 * 60 * 1000);
  setAuthCookie(res, refresh_token, 'refresh_token', 60 * 60 * 1000 * 24 * 7);

  res.redirect(`${process.env.NEXT_PUBLIC_URL}/home`);
};
