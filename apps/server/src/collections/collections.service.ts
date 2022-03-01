import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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

  async join(userId: string, collectionId: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id: collectionId },
      select: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (collection.users.find((u) => u.userId === userId)) {
      throw new ConflictException();
    }
    // what other guards??

    return this.prismaService.collection.update({
      where: { id: collectionId },
      data: {
        users: {
          create: [
            {
              role: 'MEMBER',
              user: { connect: { id: userId } },
            },
          ],
        },
      },
    });
  }

  async findOne(collectionId: string, userId: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id: collectionId },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!collection) throw new NotFoundException();
    if (collection.users.find((u) => u.userId === userId))
      throw new ConflictException();

    return collection;
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
