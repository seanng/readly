import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreateCollectionDto) {
    try {
      console.log('payload: ', payload);
      const collection = await this.prismaService.collection.create({
        data: {
          name: payload.name,
          users: {
            create: [
              {
                role: 'CREATOR',
                user: { connect: { id: payload.userId } },
              },
            ],
          },
        },
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
      });
      return collection;
    } catch (error) {
      console.log('error in create collection: ', error);
      throw error;
    }
  }
}
