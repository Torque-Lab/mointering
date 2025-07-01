import { createClient } from "redis";

type OTPData = {
    otp: string;
    expiresAt: number;
};

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

async function connectToRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
}

connectToRedis();

client.on("error", (err) => {
    console.error("Redis error:", err);
});

client.on("close", () => {
    console.log("Redis connection closed");
});

export function generateOTP(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

export async function storeOTP(email: string, otp: string, ttlInMinutes = 15): Promise<boolean> {
    try {
        const key = `otp:${email}`;
        const expiresAt = Date.now() + ttlInMinutes * 60 * 1000;
        const result = await client.set(key, JSON.stringify({ otp, expiresAt }), {
            EX: ttlInMinutes * 60,
            NX: true 
        });
        return result === 'OK';
    } catch (error) {
        console.error('Error storing OTP in Redis:', error);
        return false;
    }
}

export async function getOTP(email: string): Promise<OTPData | null> {
    try {
        const key = `otp:${email}`;
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting OTP from Redis:', error);
        return null;
    }
}

export async function deleteOTP(email: string): Promise<boolean> {
    try {
        const key = `otp:${email}`;
        await client.del(key);
        return true;
    } catch (error) {
        console.error('Error deleting OTP from Redis:', error);
        return false;
    }
}

export async function isOTPValid(email: string, otp: string): Promise<boolean> {
    try {
        const storedData = await getOTP(email);
        if (!storedData) {
            return false;
        }
        
        const isValid = storedData.otp === otp && storedData.expiresAt > Date.now();
        
        if (!isValid || storedData.expiresAt <= Date.now()) {
            await deleteOTP(email);
        }
        
        return isValid;
    } catch (error) {
        console.error('Error validating OTP:', error);
        return false;
    }
}

export async function storeToken(token: string, ttlInMinutes = 15): Promise<boolean> {
    try {
        const key = `token:${token}`;
        const expiresAt = Date.now() + ttlInMinutes * 60 * 1000;
        const result = await client.set(key, JSON.stringify({ token, expiresAt }), {
            EX: ttlInMinutes * 60,
            NX: true 
        });
        return result === 'OK';
    } catch (error) {
        console.error('Error storing token in Redis:', error);
        return false;
    }
}



type TokenData = {
    token: string;
    expiresAt: number;
};

export async function getToken(token: string): Promise<TokenData | null> {
    try {
        const key = `token:${token}`;
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting token from Redis:', error);
        return null;
    }
}

export async function deleteToken(token: string): Promise<boolean> {
    try {
        const key = `token:${token}`;
        await client.del(key);
        return true;
    } catch (error) {
        console.error('Error deleting token from Redis:', error);
        return false;
    }
}

export async function isTokenValid(token: string): Promise<boolean> {
    try {
        const storedData = await getToken(token);
        if (!storedData) {
            return false;
        }
            
            const isValid = storedData.token === token && storedData.expiresAt > Date.now();
            
            if (!isValid || storedData.expiresAt <= Date.now()) {
                await deleteToken(token);
            }
            
            return isValid;
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }