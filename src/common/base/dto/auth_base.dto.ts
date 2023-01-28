import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AuthBaseDto {
  @MaxLength(30)
  @MinLength(5)
  @IsNotEmpty()
  username: string;

  @MinLength(5)
  @IsNotEmpty()
  password: string;
}
