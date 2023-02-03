import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets/errors';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SocketIO } from 'src/common/base/socket/socketIo';
import { RedisService } from 'src/redis/redis.service';

@UseGuards(AuthGuard('jwt'))
@WebSocketGateway(80)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  async afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(@ConnectedSocket() client: any) {
    try {
      const token = client.handshake.query.token;

      const { userId } = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      console.log(userId);
      if (!userId) {
        throw new WsException('Unauthorized');
      }
      client.userId = userId;
      client.join(userId);
      await this.redisService.addUserToOnlineList(userId);
    } catch (error) {
      client.emit('error', error);
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: SocketIO) {
    if (typeof client.userId !== 'string') {
      throw new WsException('userId is not valid');
    }
    const matchingSockets = await client.in(client.userId).fetchSockets();
    const isDisconnected = matchingSockets.length === 0;
    if (isDisconnected) {
      await this.redisService.removeUserFromOnlineList(client.userId);
    }
  }
}
