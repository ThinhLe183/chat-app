import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { IUserInfo } from 'src/common/interfaces/user/userInfo.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
    });
  }

  async validate(payload: any): Promise<IUserInfo> {
    const user = await this.usersService.findOneById(payload.userId);
    if (!user) throw new BadRequestException('User does not exist');
    const { password, created_at, updated_at, ...result } = user;
    return result;
  }
}
