import { IsNumber, IsOptional, Max, Min } from 'class-validator';
export class GetMessagesDTO {
  @IsOptional()
  before: Date;
  @IsOptional()
  after: Date;
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  take: number;
}
