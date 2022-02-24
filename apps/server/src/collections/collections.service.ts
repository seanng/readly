import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, body: CreateCollectionDto) {
    try {
      const collection = await this.prismaService.collection.create({
        data: {
          name: body.name,
          users: {
            create: [
              {
                role: 'CREATOR',
                user: { connect: { id: userId } },
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

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    try {
      const collection = await this.prismaService.collection.update({
        where: { id },
        data: updateCollectionDto,
      });
      console.log('collection: ', collection);
      return collection;
    } catch (error) {
      console.log('error in update collection: ', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prismaService.collection.delete({ where: { id } });
    } catch (error) {
      console.log('error in delete collection: ', error);
      throw error;
    }
  }
}
