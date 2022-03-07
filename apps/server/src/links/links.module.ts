import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { PrismaService } from '../prisma.service';
import { SocketsModule } from '../sockets/sockets.module';

@Module({
  imports: [SocketsModule],
  controllers: [LinksController],
  providers: [LinksService, PrismaService],
})
export class LinksModule {}
