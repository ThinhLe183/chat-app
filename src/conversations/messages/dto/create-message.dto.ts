import { MessageType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
export class CreateMessageDto {
  @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;

  @IsNotEmpty()
  @MaxLength(200)
  msg: string;

  @IsOptional()
  @IsArray()
  mentions: string[];

  @IsOptional()
  @IsArray()
  attachments: string[];
}
