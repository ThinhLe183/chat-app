import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesController } from 'src/conversations/messages/messages.controller';
import { MessagesService } from './messages.service';
import { ConversationsModule } from '../conversations.module';
import { ParticipantsModule } from '../participants/participants.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    forwardRef(() => ConversationsModule),
    forwardRef(() => ParticipantsModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
