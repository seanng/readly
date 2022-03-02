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

@Controller('collections')
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    const { userId } = req.user;
    return this.service.create(userId, createCollectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Request() req, @Param() params: IDParams) {
    const { userId } = req.user;
    return this.service.join(userId, params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param() params: IDParams,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.service.update(params.id, updateCollectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param() params: IDParams) {
    const { userId } = req.user;
    return this.service.findOne(params.id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() params: IDParams) {
    return this.service.delete(params.id);
  }
}
