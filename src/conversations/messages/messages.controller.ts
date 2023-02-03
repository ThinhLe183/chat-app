import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationGuard } from 'src/conversations/guards/conversation.guard';
import { UserInfo } from 'src/users/decorators/user-info.decorator';
import { IUserInfo } from 'src/common/interfaces/user/userInfo.interface';

@UseGuards(JwtAuthGuard, ConversationGuard)
@Controller('conversations/:conversation_id/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':message_id')
  async getMessage(
    @Param('conversation_id') conversation_id: string,
    @Param('message_id') message_id: string,
  ) {
    return await this.messagesService.findOneById(conversation_id, message_id);
  }

  @Get()
  async getMessages(
    @Param('conversation_id') conversation_id: string,
    @Query('before') before?: string,
  ) {
    try {
      return await this.messagesService.findByConversationId(
        conversation_id,
        before,
      );
    } catch (error) {
      throw new BadRequestException('Invalid query please check again');
    }
  }

  @Post()
  async createMessage(
    @Param('conversation_id') conversation_id: string,
    @UserInfo() user: IUserInfo,
    @Body() dto: CreateMessageDto,
  ) {
    return await this.messagesService.createMessage(conversation_id, dto, user);
  }
}
