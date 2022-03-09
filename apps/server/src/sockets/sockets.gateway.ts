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
import { CollectionsService } from 'src/collections/collections.service';
import { CreateCollectionDto } from 'src/collections/dto/create-collection.dto';

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
    private collectionsService: CollectionsService,
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

  @SubscribeMessage('B_COLLECTION_CREATE')
  async onCollectionCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateCollectionDto,
  ) {
    const { userId } = client.data;
    const collection = await this.collectionsService.create(userId, body);
    client.join(collection.id);
    client.emit('S_COLLECTION_CREATED', collection);
  }
}
