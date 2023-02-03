import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { IUserInfo } from 'src/common/interfaces/user/userInfo.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);
    return this.login(user);
  }

  async login(user: IUserInfo) {
    return {
      user: user,
      access_token: await this.generateNewAccessToken(user),
      expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: await this.generateNewRefreshToken(user),
    };
  }

  async validateUser(dto: LoginDto): Promise<IUserInfo> {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (!user) throw new BadRequestException('User does not exist');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password incorrect');
    const { password, created_at, updated_at, ...result } = user;
    return result;
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      const timeRemaining = decoded.exp - Math.round(Date.now() / 1000); //seconds
      const user = await this.usersService.findOneById(decoded.userId);
      if (!user) throw new Error();
      return {
        access_token: await this.generateNewAccessToken(user),
        refresh_token: await this.generateNewRefreshToken(user, timeRemaining),
      };
    } catch (error) {
      throw new HttpException('Token invalid or expired', 404);
    }
  }

  private async generateNewAccessToken(user: IUserInfo) {
    const payload = {
      username: user.username,
      userId: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '3600'),
    });
    return accessToken;
  }

  private async generateNewRefreshToken(
    user: IUserInfo,
    timeRemaining?: number,
  ) {
    const payload = {
      username: user.username,
      userId: user.id,
      email: user.email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: timeRemaining || process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
    return refreshToken;
  }
}
