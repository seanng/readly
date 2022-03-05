import {
  SubscribeMessage,
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { SocketsService } from './sockets.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private authService: AuthService,
    private socketsService: SocketsService,
  ) {}

  private logger: Logger = new Logger('SocketsGateway');

  afterInit(server: Server) {
    this.socketsService.socket = server;
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const user = await this.authService.getUserFromAuthToken(
        client.handshake.auth.token,
      );
      const collectionIdList = user.collections.map((c) => c.collectionId);
      this.logger.log(`Client connected: ${client.id}`);
      client.join(collectionIdList);
    } catch (error) {
      console.log('error: ', error);
      client.disconnect();
    }
  }
}
