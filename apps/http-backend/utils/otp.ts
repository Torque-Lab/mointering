import { redisService } from '../services/redis.service';


export const getRedisClient =async() => {
    try {
        return await redisService.getClient();
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
        const client = await getRedisClient();
        const result = await client.set(key, JSON.stringify({ otp }), {
            expiration: { type: 'EX', value: ttlInMinutes * 60 },
            NX: true
        });
        return result === 'OK';
    } catch (error) {
        console.error('Error storing OTP in Redis:', error);
        return false;
    }
}

export async function getOTP(email: string): Promise<{otp:string} | null> {
    try {
        const key = `otp:${email}`;
        const client = await getRedisClient();
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
        const client = await getRedisClient();
        const result = await client.set(key, JSON.stringify({ token }), {
            expiration: { type: 'EX', value: ttlInMinutes * 60 },
        });
        return result === 'OK';
    } catch (error) {
        console.error('Error storing token in Redis:', error);
        return false;
    }
}

export async function getToken(token: string): Promise<{token:string} | null> {
    try {
        const key = `token:${token}`;
        const client = await getRedisClient();
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

export async function SetKeyValue(key:string,value:number,ttlInDay = 7):Promise<boolean>{
    try {
        const client = await getRedisClient();
        const result = await client.set(key, JSON.stringify(value),{
            expiration: { type: 'EX', value: ttlInDay*24 * 60*60 },
        });
        return result === 'OK';
    } catch (error) {
        console.error('Error storing key-value pair in Redis:', error);
        return false;
    }
}

export async function GetKeyValue(key:string):Promise<{value:number} | null>{
    try {
        const client = await getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting key-value pair from Redis:', error);
        return null;
    }
}

export async function DeleteKey(key:string):Promise<boolean>{
    try {
        const client = await getRedisClient();
        const result = await client.del(key);
        return result === 1;
    } catch (error) {
        console.error('Error deleting key-value pair from Redis:', error);
        return false;
    }
}

export async function IncreaseValueOfKey(key:string,ttlInDay = 7):Promise<{value:number} | null>{
    try {
        const client = await getRedisClient();
            const exist = await client.exists(key);
        if(exist){
            const result = await client.incr(key);
            return {value:result};
        }
        const result = await client.set(key, JSON.stringify(1),{
            expiration: { type: 'EX', value: ttlInDay*24 * 60*60 },
        });
        return result === 'OK' ? {value:1} : null;
    } catch (error) {
        console.error('Error increasing key-value pair from Redis:', error);
        return null;
    }
}