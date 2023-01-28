import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserInfo } from './decorators/user-info.decorator';
import { User } from 'prisma/prisma-client';
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@UserInfo() user: User) {
    return user;
  }

  @Get('')
  async getUsers() {
    return this.prisma.user.findMany();
  }
}
