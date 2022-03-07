import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { UpdateLinkDto } from './dto/update-link.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLinkDto } from './dto/create-link.dto';
import { SocketsService } from '../sockets/sockets.service';

@Controller('links')
export class LinksController {
  constructor(
    private readonly service: LinksService,
    private socketsService: SocketsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createLinkDto: CreateLinkDto) {
    const { userId } = req.user;
    const link = await this.service.create(userId, createLinkDto);
    this.socketsService.socket
      .to(createLinkDto.collectionId)
      .emit('S_NEW_LINK', {
        userId,
        collectionId: createLinkDto.collectionId,
        link,
      });
    return link;
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.service.update(id, updateLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const { userId } = req.user;
    const link = await this.service.delete(id);
    this.socketsService.socket.to(link.collectionId).emit('S_DELETE_LINK', {
      userId,
      collectionId: link.collectionId,
      linkId: id,
    });

    return link;
  }
}
