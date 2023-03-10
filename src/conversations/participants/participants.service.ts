import { Injectable } from '@nestjs/common';
import { Participant } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ParticipantsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async findByConversationId(conversationId: string) {
    return await this.prisma.conversation
      .findFirst({
        where: { id: conversationId },
        select: { participants: true },
      })
      .then((res) => res?.participants);
  }

  async createParticipantByIds(uids: string[]): Promise<Participant[]> {
    const users = await this.usersService.findByIds(uids, {
      select: { id: true, username: true, avatar: true, name: true },
    });
    return users.map((user) => {
      return { ...user, nickname: null, last_read: null };
    });
  }

  async addParticipant(conversation_id: string, uid: string) {
    const participant = await this.createParticipantByIds([uid]);
    return this.prisma.conversation.update({
      where: { id: conversation_id },
      data: { participants: { push: participant } },
    });
  }

  async setReadMessage(id: string, uid: string, msgid: string) {
    return await this.prisma.conversation
      .update({
        where: { id },
        data: {
          participants: {
            updateMany: { where: { id: uid }, data: { last_read: msgid } },
          },
        },
        select: { participants: { select: { id: true, last_read: true } } },
      })
      .then((res) => res.participants.find((p) => p.id === uid));
  }
}
