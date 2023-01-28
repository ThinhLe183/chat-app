import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ICrudOptions } from 'src/common/interfaces/prisma/ICrudOptions';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneById(uid: string, option?: ICrudOptions) {
    return await this.prisma.user.findUnique({ where: { id: uid }, ...option });
  }
  async findByIds(uids: string[], option?: ICrudOptions) {
    return await this.prisma.user.findMany({
      where: { id: { in: uids } },
      ...option,
    });
  }

  async findOneByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    console.log(dto.email);
    return await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  }
}
