import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreateLinkDto) {
    try {
      const link = await this.prismaService.link.create({
        data: {
          collection: {
            connect: { id: payload.collectionId },
          },
          url: payload.url,
          title: payload.title,
          description: payload.description,
          faviconUrl: payload.faviconUrl,
          readerInfo: {
            [payload.userId]: { hasReadIt: false },
          },
        },
      });
      return link;
    } catch (error) {
      console.log('error in create link: ', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all links`;
  }

  findOne(id: number) {
    return `This action returns a #${id} link`;
  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return `This action updates a #${id} link`;
  }

  delete(id: string) {
    try {
      return this.prismaService.link.delete({ where: { id } });
    } catch (error) {
      console.log('error in delete link: ', error);
      throw error;
    }
  }
}
