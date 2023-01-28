import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);
    return this.login(user);
  }

  async login(user: any) {
    return {
      user_id: user.id,
      access_token: await this.generateNewAccessToken(user),
      expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: await this.generateNewRefreshToken(user),
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (!user) throw new BadRequestException('User does not exist');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password incorrect');
    const { password, ...result } = user;
    return result;
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      const timeRemaining = decoded.exp - Math.round(Date.now() / 1000); //seconds
      const user = await this.usersService.findOneById(decoded.userId);
      return {
        access_token: await this.generateNewAccessToken(user),
        refresh_token: await this.generateNewRefreshToken(user, timeRemaining),
      };
    } catch (error) {
      throw new HttpException('Token invalid or expired', 404);
    }
  }

  private async generateNewAccessToken(user: any) {
    const payload = { username: user.username, userId: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '3600'),
    });
    return accessToken;
  }

  private async generateNewRefreshToken(user: any, timeRemaining?: number) {
    const payload = { username: user.username, userId: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: timeRemaining || process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
    return refreshToken;
  }
}