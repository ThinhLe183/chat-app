import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './conversations/messages/messages.module';
import { ParticipantsModule } from './conversations/participants/participants.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    PrismaModule,
    ConversationsModule,
    MessagesModule,
    ParticipantsModule,
  ],
})
export class AppModule {}
