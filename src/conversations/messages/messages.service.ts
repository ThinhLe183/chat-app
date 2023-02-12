import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationsService } from 'src/conversations/conversations.service';
import { IUserInfo } from 'src/common/interfaces/user/userInfo.interface';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private conversationsService: ConversationsService,
  ) {}

  async createMessage(
    conversation_id: string,
    dto: CreateMessageDto,
    { email, ...user }: IUserInfo,
  ) {
    const message = await this.prisma.message.create({
      data: {
        conversation_id,
        author: user,
        ...dto,
      },
    });
    await this.conversationsService.incAndSetLastMessage(conversation_id, {
      type: message.type,
      author_id: message.author.id,
      author_name: message.author.name,
      msg: message.msg,
      mentions: message.mentions,
      attachments: message.attachments,
      ts: message.ts,
    });
    return message;
  }

  async findOneById(conversation_id: string, message_id: string) {
    return await this.prisma.message.findFirst({
      where: { conversation_id, id: message_id },
    });
  }

  async findByConversationId(conversation_id: string, before?: string) {
    return await this.prisma.message.findMany({
      where: {
        conversation_id,
        ts: { lt: before },
      },
      take: 30,
    });
  }
}
