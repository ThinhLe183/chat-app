import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({ host: '127.0.0.1', port: 6379 });
  }

  async addUserToOnlineList(uid: string) {
    await this.client.sadd('onlineUsers', uid);
  }

  async removeUserFromOnlineList(uid: string) {
    await this.client.srem('onlineUsers', uid);
  }

  async getOnlineUsers() {
    return await this.client.smembers('onlineUsers');
  }

  async isUserOnline(uid: string) {
    const isExist = await this.client.sismember('onlineUsers', uid);
    return isExist ? true : false;
  }
}
