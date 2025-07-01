
import { SignUpSchema } from "../zod/authSchema";
import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express";
import { SignInSchema } from "../zod/authSchema";
import { ForgotSchema } from "../zod/authSchema";
import { ResetSchema } from "../zod/authSchema";
import { deleteToken, generateOTP, isTokenValid, storeToken } from "../utils/otp";
import { storeOTP } from "../utils/otp";
import { sendOTPEmail, sendPasswordResetEmail } from "../utils/sendOtp";
import { isOTPValid } from "../utils/otp";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function setAuthCookie(res: Response, token: string, token_name: string,maxAge:number) {
    const isDev = process.env.NODE_ENV === "development";
    res.cookie(token_name, token, {
      httpOnly: true,
      secure: !isDev,
      sameSite: "strict",
      maxAge: maxAge,
      path: "/"
    });
  }
  

export const signUp = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
       const parsedData = SignUpSchema.safeParse(req.body);
       if(!parsedData.success) {
         res.status(400).json({ error: "Invalid data" });
         return;
       }
       const { username, password, name, image } = parsedData.data;
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = await prismaClient.user.create({
        data: {
            username,
            password: hashedPassword,
            name,
            image
        }
       });
       res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const parsedData = SignInSchema.safeParse(req.body);
        if(!parsedData.success) {
            res.status(400).json({ error: "Invalid data" });
            return;
        }
        const { username, password } = parsedData.data;
        const user = await prismaClient.user.findUnique({
            where: {
                username: username
            }
        });
        if(!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }
        const access_token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET_ACCESS!,);
        const refresh_token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET_REFRESH!,);
        
        setAuthCookie(res, access_token, "access_token",60 * 60 * 1000);
        setAuthCookie(res, refresh_token, "refresh_token",60 * 60 * 1000*24*7);
        
        res.status(200).json({ message: "User signed in successfully" });
    } catch (error) {
       console.log(error);
       res.status(500).json({ error: "Failed to sign in" });
    }
};
        
     

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to sign out" });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH || 'your-secret-key') as { userId: string };
        if (!decoded.userId) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const access_token = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_ACCESS || 'your-secret-key');
     
        setAuthCookie(res, access_token, "access_token",60 * 60 * 1000);
        res.status(200).json({ access_token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to refresh token" });
    }
};
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const parsedData = ForgotSchema.safeParse(req.body);
    
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }
    
        const email = parsedData.data.username;
        const user = await prismaClient.user.findFirst({
          where: {
            username: email,
          },
        });
    
        if (!user) {
            res.status(403).json({ message: "Invalid Credentials" });
            return;
        }
    
        if (user) {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_ACCESS || 'your-secret-key');
            storeToken(token);  
            const link = `http://localhost:3000/reset-password?oneTimeToken=${token}`;
            sendPasswordResetEmail(email, link);
        }
    
        res.status(200).json({
          message:
            "if the user is registered,you will recive an OTP with in 5 Minute",
        });
      } catch (error) {
         console.log(error);
         res.status(500).json({ error: "Internal server error" });
         return;
      }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const parsedData = ResetSchema.safeParse(req.body);
    
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }
    
        const { username, token, newPassword } = parsedData.data;

        const isValidToken = isTokenValid(token);
    
        if (!isValidToken) {
          res.status(403).json({ message: "Invalid Token" });
          return;
        }
    
        const user = await prismaClient.user.findFirst({
          where: {
            username: username,
          },
        });
    
        if (!user) {
          res.status(403).json({ message: "Invalid Credentials" });
          return;
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);  
        await prismaClient.user.update({
            where: { username },
            data: { password: hashedPassword },
        });
        deleteToken(token);     
    
         res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};  

export const getProfile = async (req: Request, res: Response) => {

const access_token = req.cookies.access_token;
console.log("HEADERS:", req.headers);
console.log("RAW COOKIE HEADER:", req.headers.cookie);
console.log("PARSED COOKIES:", req.cookies);

if (!access_token) {
    res.status(401).json({ error: "Invalid token" });
    return;
}
const decoded = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS || '') as { userId: string };
if (!decoded.userId) {
    res.status(401).json({ error: "Invalid token" });
    return;
}
const user = await prismaClient.user.findUnique({
    where: {
        id: decoded.userId,
    },
    select: {
        id: true,
        username: true,
        name: true,
        image: true,
        createdAt: true,
    },
});

if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
}

res.status(200).json(user);
};