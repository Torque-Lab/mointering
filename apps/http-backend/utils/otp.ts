import { redisService } from '../services/redis.service';

type OTPData = {
    otp: string;
};

type TokenData = {
    token: string;
};


// Helper function to get Redis client with error handling
const getRedisClient = () => {
    try {
        return redisService.getClient();
    } catch (error) {
        console.error('Failed to get Redis client:', error);
        throw new Error('Redis client is not available');
    }
};

export function generateOTP(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

export async function storeOTP(email: string, otp: string, ttlInMinutes = 15): Promise<boolean> {
    try {
        const key = `otp:${email}`;
        const client = getRedisClient();
        const result = await client.setEx(key, ttlInMinutes * 60, JSON.stringify({ otp }));
        return result === 'OK';
    } catch (error) {
        console.error('Error storing OTP in Redis:', error);
        return false;
    }
}


export async function getOTP(email: string): Promise<OTPData | null> {
    try {
        const key = `otp:${email}`;
        const client = getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting OTP from Redis:', error);
        return null;
    }
}

export async function isOTPValid(email: string, otp: string): Promise<boolean> {
    try {
        const storedData = await getOTP(email);
        if (!storedData) {
            return false;
        }
        
        const isValid = storedData.otp === otp;
        
        return isValid;
    } catch (error) {
        console.error('Error validating OTP:', error);
        return false;
    }
}

export async function storeToken(token: string, ttlInMinutes = 15): Promise<boolean> {
    try {
        const key = `token:${token}`;
        const client = getRedisClient();
        const result = await client.setEx(key, ttlInMinutes * 60, JSON.stringify({ token }));
        return result === 'OK';
    } catch (error) {
        console.error('Error storing token in Redis:', error);
        return false;
    }
}



export async function getToken(token: string): Promise<TokenData | null> {
    try {
        const key = `token:${token}`;
        const client = getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting token from Redis:', error);
        return null;
    }
}

export async function isTokenValid(token: string): Promise<boolean> {
    try {
        const storedData = await getToken(token);
        if (!storedData) {
            return false;
        } 
        const isValid = storedData.token === token;
        return isValid;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}

export async function SetKeyValue(key:string,value:number,ttlInMinutes = 24):Promise<boolean>{
    try {
        const client = getRedisClient();
        const result = await client.setEx(key, ttlInMinutes * 60 * 60, JSON.stringify(value));
        return result === 'OK';
    } catch (error) {
        console.error('Error storing key-value pair in Redis:', error);
        return false;
    }
}

export async function GetKeyValue(key:string):Promise<number | null>{
    try {
        const client = getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting key-value pair from Redis:', error);
        return null;
    }
}

export async function DeleteKey(key:string):Promise<boolean>{
    try {
        const client = getRedisClient();
        const result = await client.del(key);
        return result === 1;
    } catch (error) {
        console.error('Error deleting key-value pair from Redis:', error);
        return false;
    }
}

export async function IncreaseValueOfKey(key:string,ttlInMinutes = 24):Promise<number | null>{
    try {
        const client = getRedisClient();
        const exists = await client.exists(key);
        if (exists) {
            const result = await client.incr(key);
            return result;
        }
        const result = await client.setEx(key, ttlInMinutes * 60 * 60, '1');
        return result === 'OK' ? 1 : null;
    } catch (error) {
        console.error('Error increasing key-value pair from Redis:', error);
        return null;
    }
}