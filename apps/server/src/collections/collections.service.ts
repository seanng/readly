import { Injectable } from '@nestjs/common';
import { CollectionInput } from './collections.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CollectionInput) {
    try {
      this.prismaService.collection.create({
        data,
      });
    } catch (e) {}
  }
}
