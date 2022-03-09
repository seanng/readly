import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CollectionsModule as InitialCollectionsModule } from 'src/collections/collections.module';
import { SocketsGateway } from './sockets.gateway';
import { SocketsService } from './sockets.service';

const CollectionsModule = forwardRef(() => InitialCollectionsModule);

@Module({
  imports: [AuthModule, CollectionsModule],
  providers: [SocketsGateway, SocketsService],
  exports: [SocketsGateway, SocketsService],
})
export class SocketsModule {}
