import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { AuthBaseDto } from 'src/common/base/dto/auth_base.dto';
export class CreateUserDto extends AuthBaseDto {
  @MinLength(5)
  @MaxLength(20)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
