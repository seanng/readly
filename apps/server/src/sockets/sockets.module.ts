import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketsGateway } from './sockets.gateway';
import { SocketsService } from './sockets.service';

@Module({
  imports: [AuthModule],
  providers: [SocketsGateway, SocketsService],
  exports: [SocketsGateway, SocketsService],
})
export class SocketsModule {}
