import {
  Controller,
  Post,
  Request,
  Delete,
  Param,
  UseGuards,
  Body,
  Patch,
  Get,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { IDParams } from './params/id.params';
import { SocketsService } from '../sockets/sockets.service';

@Controller('collections')
export class CollectionsController {
  constructor(
    private collectionsService: CollectionsService,
    private socketsService: SocketsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    const { userId } = req.user;
    return this.collectionsService.create(userId, createCollectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Request() req, @Param() params: IDParams) {
    const { userId } = req.user;
    const collection = await this.collectionsService.join(userId, params.id);
    const userObj = collection.users.find((u) => u.user.id === userId);
    this.socketsService.socket.to(params.id).emit('NEW_JOINER', userObj.user);
    return collection;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param() params: IDParams,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(params.id, updateCollectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param() params: IDParams) {
    const { userId } = req.user;
    return this.collectionsService.findOne(params.id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() params: IDParams) {
    return this.collectionsService.delete(params.id);
  }
}
