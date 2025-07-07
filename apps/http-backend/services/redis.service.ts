import { createClient, RedisClientType } from 'redis';

export class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    const redisUrl =
      process.env.REDIS_URL && process.env.REDIS_URL.trim().length > 0
        ? process.env.REDIS_URL.trim()
        : 'redis://localhost:6379';

    this.client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.error('Max Redis reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 200, 1000);
        },
      },
    });

    this.setupEventListeners();

    this.connect().catch((err) => {
      console.error('Redis connection failed on startup:', err);
    });
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
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      console.log('Redis client reconnecting...');
    });
  }

  public async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await this.client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.client.quit();
      this.isConnected = false;
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
  }

  public getClient(): RedisClientType {
    if (!this.isConnected) {
      console.error('Redis client is not connected');
    
    }
    return this.client;
  }
}

// Export singleton instance
export const redisService = RedisService.getInstance();
