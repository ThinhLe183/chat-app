import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserInfo } from 'src/common/interfaces/user/userInfo.interface';

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IUserInfo = request.user;
    return data ? request.user?.[data] : user;
  },
);
