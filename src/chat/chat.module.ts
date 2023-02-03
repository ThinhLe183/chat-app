import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [RedisModule, JwtModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
