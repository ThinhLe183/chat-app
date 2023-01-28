import { IsArray, IsNotEmpty } from 'class-validator';
export class CreateDirectMessageDTO {
  @IsNotEmpty()
  @IsArray()
  participant_ids: string[];
}
