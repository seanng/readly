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
import { FindOneParams } from './params/find-one.params';

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
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.service.update(id, updateCollectionDto);
  }

  @Get(':id')
  findOne(@Param() params: FindOneParams) {
    return this.service.findOne(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
