import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CollectionsController } from './collections/collections.controller';
import { CollectionsService } from './collections/collections.service';
import { CollectionsModule } from './collections/collections.module';
import { LinksModule } from './links/links.module';
import { LinksController } from './links/links.controller';
import { LinksService } from './links/links.service';

@Module({
  imports: [AuthModule, UsersModule, CollectionsModule, LinksModule],
  controllers: [AppController, CollectionsController, LinksController],
  providers: [PrismaService, CollectionsService, LinksService],
})
export class AppModule {}
