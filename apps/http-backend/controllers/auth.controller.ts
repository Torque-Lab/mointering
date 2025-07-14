
import { SignUpSchema } from "../zodSchema/authSchema";
import { prismaClient } from "@repo/db";
import { Request, Response } from "express";   
import crypto from "crypto";
import { SignInSchema } from "../zodSchema/authSchema";
import { ForgotSchema } from "../zodSchema/authSchema";
import { ResetSchema } from "../zodSchema/authSchema";
import { GetKeyValue, IncreaseValueOfKey, isTokenValid, SetKeyValue, storeToken } from "../utils/otp";
import { sendPasswordResetEmail } from "../utils/sendOtp";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export function setAuthCookie(res: Response, token: string, token_name: string,maxAge:number) {
    const isDev = process.env.NODE_ENV === "development";
    res.cookie(token_name, token, {
      httpOnly: true,
      secure: !isDev,
      sameSite: "strict",
      maxAge: maxAge,
      path: "/"
    });
  }
  
export function generateTimeId(): string{
    let timeId="";
    const option=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9", "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    for(let i=0;i<18;i++){
        timeId+=option[Math.floor(Math.random() * option.length)];
    }
    timeId+=Date.now();
    return timeId;
}

export const signUp = async (req: Request, res: Response) => {
    try {
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
        const failedAttempts = await GetKeyValue(username);
        if (failedAttempts?.value != null && failedAttempts.value >= 6) {
           res.status(403).json({ message: "Too many failed login attempts. Try again in 24 hours  or reset your password" });
           return;
        }
        
        const user = await prismaClient.user.findUnique({ where: { username } });
        
        const isValid = user && await bcrypt.compare(password, user.password);
        if (!isValid) {
            await IncreaseValueOfKey(username,7);
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        const payload1= {
            timeId:generateTimeId(),
            userId:user.id,
            tokenId: crypto.randomUUID(), 
            issuedAt: Date.now(), 
            nonce: crypto.randomBytes(16).toString('hex')

        }
        const payload2= {
            timeId:generateTimeId(),
            userId:user.id,
            tokenId: crypto.randomUUID(), 
            issuedAt: Date.now(), 
            nonce: crypto.randomBytes(16).toString('hex')
        }
        const access_token = jwt.sign({ payload1}, process.env.JWT_SECRET_ACCESS!,);
        const refresh_token = jwt.sign({ payload2}, process.env.JWT_SECRET_REFRESH!,);
        
        setAuthCookie(res, access_token, "access_token",60 * 60 * 1000);
        setAuthCookie(res, refresh_token, "refresh_token",60 * 60 * 1000*24*7);
        
        res.status(200).json({ message: "User signed in successfully" });
    } catch (error) {
       console.log(error);
       res.status(500).json({ error: "Failed to sign in" });
    }
};

export const csurf = async (req: Request, res: Response) => {
    try {
        const token = crypto.randomBytes(16).toString('hex');
       setAuthCookie(res, token, "csurf_token",60 * 60 * 1000);
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to generate token" });
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
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH || '78yh76tvt7ividtgd75tbftewg') as { userId: string ,timeId: string ,tokenId: string ,issuedAt: number};
        if (!decoded.userId) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const payload1= {
            timeId:generateTimeId(),
            userId:decoded.userId,
            tokenId: crypto.randomUUID(), 
            issuedAt: Date.now(), 
            nonce: crypto.randomBytes(16).toString('hex')
        }
        const access_token = jwt.sign({ payload1}, process.env.JWT_SECRET_ACCESS || 'z78hei7ritgfb67385vg7667');
     
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
            res.status(400).json({ message: "Invalid data",success:false });
            return;
        }
    
        const email = parsedData.data.username;
        const forgotAttempts = await GetKeyValue(email);
        if(forgotAttempts?.value!=null && forgotAttempts.value>4){
            res.status(403).json({ message: "Too many requests try after 24 hours",success:false });
            return;
        }
        const user = await prismaClient.user.findFirst({
          where: {
            username: email,
          },
        });
    
        if (!user) {
            res.status(403).json({ message: "Invalid Credentials",success:false });
            return;
        }
    
        if (user) {
            await IncreaseValueOfKey(email,1);
            const resetPayload={
                timeId:generateTimeId(),
                userId:user.id,
                tokenId: crypto.randomUUID(), 
                issuedAt: Date.now(), 
                nonce: crypto.randomBytes(16).toString('hex')
            }

            const token = jwt.sign({ resetPayload }, process.env.JWT_SECRET_ACCESS || 'z78hei7ritgfb67385vg7667');
            if(await storeToken(token)){
                const link = `${process.env.NEXT_PUBLIC_URL}/reset-password?oneTimeToken=${token}`;
                 await sendPasswordResetEmail(email, link);
            }  
            
        }
    
        res.status(200).json({
          message:
            "if the user is registered,you will received password reset link in 5 minutes",
            success:true
        });
      } catch (error) {
         console.log(error);
         res.status(500).json({ error: "Internal server error",success:false });
         return;
      }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const parsedData = ResetSchema.safeParse(req.body);
    
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid data",success:false });
            return;
        }
        const { token, newPassword } = parsedData.data;
        const resetPayloadData = jwt.verify(token, process.env.JWT_SECRET_ACCESS || 'z78hei7ritgfb67385vg7667') as {resetPayload:{ userId: string ,timeId: string ,tokenId: string ,issuedAt: number}};
    
        if (!await isTokenValid(token)) {
          res.status(403).json({ message: "Invalid Token",success:false });
          return;
        }
    
        const user = await prismaClient.user.findFirst({
          where: {
            id: resetPayloadData.resetPayload.userId,
          },
        });
    
        if (!user) {
          res.status(403).json({ message: "Invalid Credentials",success:false });
          return;
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);  
        await prismaClient.user.update({
            where: { id: resetPayloadData.resetPayload.userId },
            data: { password: hashedPassword },
        });   
    
         res.status(200).json({ message: "Password reset successfully",success:true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error",success:false });
    }
};  

export const getSession = async (req: Request, res: Response) => {

const userId=req.userId;
const user = await prismaClient.user.findUnique({
    where: {
        id: userId,
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
    res.status(401).json({ error: "User not found",success:false });
    return;
}

res.status(200).json({user,success:true});
};