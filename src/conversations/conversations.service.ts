import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { ConversationType, ELastMessage, EUser } from '@prisma/client';
import { UpdateConversationDTO } from './dto/update-DM.dto';
import { ICrudOptions } from 'src/common/interfaces/prisma/ICrudOptions';
import { ParticipantsService } from '../participants/participants.service';

@Injectable()
export class ConversationsService {
  constructor(
    private prisma: PrismaService,
    private participantsService: ParticipantsService,
  ) {}

  async findOneById(conversation_id: string, option?: ICrudOptions) {
    return await this.prisma.conversation.findUnique({
      where: { id: conversation_id },
      ...option,
    });
  }

  async findByUserId(uid: string, option?: ICrudOptions) {
    return await this.prisma.conversation.findMany({
      where: { participants: { some: { id: uid } }, ...option },
    });
  }

  async find1On1ConversationContainingUserId(uid: string, userId: string) {
    return await this.prisma.conversation.findFirst({
      where: {
        type: ConversationType.DM,
        participants: { every: { id: { in: [uid, userId] } } },
      },
    });
  }

  async findGroupConversationsContainingUserIds(
    uids: string[],
    userId: string,
  ) {
    return await this.prisma.conversation.findMany({
      where: {
        type: ConversationType.GROUP_DM,
        participants: { every: { id: { in: [...uids, userId] } } },
      },
    });
  }

  async updateConversation(id: string, dto: UpdateConversationDTO) {
    return await this.prisma.conversation.update({
      where: { id },
      data: dto,
    });
  }

  async incAndSetLastMessage(id: string, last_message: ELastMessage) {
    return await this.prisma.conversation.update({
      where: { id },
      data: { last_message, total_messages_sent: { increment: 1 } },
    });
  }

  async createDirectConversation(participant_ids: string[], user: EUser) {
    const type =
      participant_ids.length < 2
        ? ConversationType.DM
        : ConversationType.GROUP_DM;

    // return existed conversation if it exist ( just for DM conversation )
    if (type === ConversationType.DM) {
      const existedConversation =
        await this.find1On1ConversationContainingUserId(
          participant_ids[0],
          user.id,
        );
      if (existedConversation) return existedConversation;
    }

    const participants = await this.participantsService.createParticipantByIds(
      participant_ids,
    );

    return await this.prisma.conversation.create({
      data: {
        type,
        participants: [...participants, user],
        owner_id: type === ConversationType.GROUP_DM ? user.id : null,
      },
    });
  }
}
