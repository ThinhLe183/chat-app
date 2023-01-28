import { IsOptional } from 'class-validator';
export class UpdateConversationDTO {
  @IsOptional()
  name: string;
  @IsOptional()
  icon: string;
}
