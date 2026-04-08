import Redis from 'ioredis';

const uri = process.env.REDIS_URI;

export const redis = new Redis(uri);
