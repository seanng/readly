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
// import { CollectionsService } from 'src/collections/collections.service';

interface Body {
  message: string;
  data: unknown;
}

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
    private socketsService: SocketsService, // private collectionsService: CollectionsService,
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
      client.data.userId = user.id;
      client.join(collectionIdList);
    } catch (error) {
      console.log('error: ', error);
      client.disconnect();
    }
  }

  @SubscribeMessage('CLIENT_EMISSION')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Body,
  ) {
    const { message, data } = body;
    // const { userId } = client.data;
    // if (message === 'B_LEAVE_COLLECTION') {
    //   await this.collectionsService;
    // }
    // console.log('heard in backend.', data);
    // client.leave()
  }
}
