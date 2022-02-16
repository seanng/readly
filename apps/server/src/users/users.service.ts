import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserInput } from '../auth/auth.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async me(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        // get other user info such as avatarUrl, etc.
        collections: {
          select: {
            role: true,
            collection: {
              include: {
                links: true,
              },
            },
          },
        },
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async create(data: UserInput) {
    return this.prismaService.user.create({ data });
  }
}
