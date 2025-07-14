import { createClient, RedisClientType } from 'redis';;
export class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;

  private constructor() {
    const redisUrl = process.env.REDIS_URL?.trim() || 'redis://localhost:6379';
    this.client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.error(' Max Redis reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 200, 1000);
        },
      },
    });

    this.setupEventListeners();
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  private setupEventListeners(): void {
    this.client.on('connect', () => {
      console.log('Redis client connected');
    });

    this.client.on('error', (err) => {
      console.error(' Redis client error:', err);
    });

    this.client.on('reconnecting', () => {
      console.log('Redis client reconnecting...');
    });
  }

  public async connect(): Promise<void> {
    if (this.client.isOpen) return;

    try {
      await this.client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.client.isOpen) return;

    try {
      await this.client.quit();
      console.log('Redis client disconnected');
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
  }

  public async getClient():Promise<RedisClientType>{
    if(!this.client.isOpen){
      await this.connect();
    }
    return this.client;
  }
}

export const redisService = RedisService.getInstance();
