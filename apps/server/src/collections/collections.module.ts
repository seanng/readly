import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { PrismaService } from '../prisma.service';
import { SocketsModule } from '../sockets/sockets.module';

@Module({
  imports: [SocketsModule],
  controllers: [CollectionsController],
  providers: [CollectionsService, PrismaService],
})
export class CollectionsModule {}
