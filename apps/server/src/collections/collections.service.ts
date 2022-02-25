import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FindOneParams } from './params/find-one.params';
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

  async findOne(id: string) {
    return this.prismaService.collection.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.prismaService.collection.update({
      where: { id },
      data: updateCollectionDto,
    });
  }

  async delete(id: string) {
    return this.prismaService.collection.delete({ where: { id } });
  }
}
