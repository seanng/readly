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
        // get user info
        id: true,
        email: true,
        collections: {
          select: {
            role: true,
            collection: {
              include: {
                links: true,
                // get collection participants
                users: {
                  select: {
                    role: true,
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
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
