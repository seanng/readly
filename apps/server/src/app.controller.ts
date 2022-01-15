import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User as UserModel, Prisma } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('signup')
  async signupUser(
    @Body()
    userData: {
      email: string;
      password: string;
    },
  ): Promise<{ token: string; email: string }> {
    console.log('im in!! ', userData);
    const user = await this.prismaService.user.create({
      data: {
        email: userData.email,
        password: userData?.password,
      },
    });
    console.log('user: ', user);
    return {
      token: 'asdf',
      email: userData.email,
    };
  }
}
