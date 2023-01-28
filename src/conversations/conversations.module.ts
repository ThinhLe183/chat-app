import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesService } from '../messages/messages.service';
import { ParticipantsService } from '../participants/participants.service';
import { MessagesController } from 'src/messages/messages.controller';
import { ParticipantsController } from 'src/participants/participants.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [
    ConversationsController,
    MessagesController,
    ParticipantsController,
  ],
  providers: [ConversationsService, MessagesService, ParticipantsService],
  exports: [ConversationsService, MessagesService, ParticipantsService],
})
export class ConversationsModule {}
