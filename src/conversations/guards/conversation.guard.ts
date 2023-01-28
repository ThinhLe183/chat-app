import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ParticipantsService } from 'src/participants/participants.service';

@Injectable()
export class ConversationGuard implements CanActivate {
  constructor(private participantsService: ParticipantsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const participants = await this.participantsService.findByConversationId(
      request.params.conversation_id,
    );
    if (!participants) {
      throw new BadRequestException('Conversation id might not exist');
    }
    const isInConversation = participants.find((p) => p.id === user.id);
    if (!isInConversation) {
      throw new ForbiddenException('User is not in this conversation');
    }
    console.log('working');
    return true;
  }
}
