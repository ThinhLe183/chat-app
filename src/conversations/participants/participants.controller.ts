import { Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConversationGuard } from 'src/conversations/guards/conversation.guard';
import { UserInfo } from 'src/users/decorators/user-info.decorator';

@UseGuards(JwtAuthGuard, ConversationGuard)
@Controller('conversations/:conversation_id/participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Put(':user_id')
  async addParticipant(
    @Param('conversation_id') id: string,
    @Param('user_id') uid: string,
  ) {
    return await this.participantsService.addParticipant(id, uid);
  }

  @Get()
  async getAllParticipants(@Param('conversation_id') conversation_id: string) {
    return this.participantsService.findByConversationId(conversation_id);
  }

  @Patch()
  async updateReadMessage(
    @Param('conversation_id') id: string,
    @UserInfo('id') uid: string,
  ) {
    return await this.participantsService.setReadMessage(id, uid);
  }
}
