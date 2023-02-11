import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateConversationDTO } from './dto/update-DM.dto';
import { CreateDirectMessageDTO } from './dto/create-DM.dto';
import { ConversationGuard } from './guards/conversation.guard';
import { UserInfo } from 'src/users/decorators/user-info.decorator';
import { IUserInfo } from 'src/common/interfaces/user/userInfo.interface';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}
  @Get()
  async getAllConversations(@UserInfo('id') uid: string) {
    console.log(uid);
    return await this.conversationsService.findByUserId(uid);
  }

  @Get(':conversation_id')
  @UseGuards(ConversationGuard)
  async getConversation(@Param('conversation_id') id: string) {
    return await this.conversationsService.findOneById(id);
  }

  @Post()
  async createDM(
    @Body() dto: CreateDirectMessageDTO,
    @UserInfo() user: IUserInfo,
  ) {
    return await this.conversationsService.createDirectConversation(
      dto.participant_ids,
      user,
    );
  }

  @Patch(':conversation_id')
  @UseGuards(ConversationGuard)
  async modifyConversation(
    @Param('conversation_id') id: string,
    @Body() dto: UpdateConversationDTO,
  ) {
    return await this.conversationsService.updateConversation(id, dto);
  }
}
