import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UserInfo } from 'src/users/decorators/user-info.decorator';
import { IUserInfo } from 'src/common/interfaces/user/userInfo.interface';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@UserInfo() user: IUserInfo) {
    return await this.authService.login(user);
  }
  @Post('refreshToken')
  async refreshToken(@Body() body: any) {
    return await this.authService.refreshToken(body.refresh_token);
  }
}
