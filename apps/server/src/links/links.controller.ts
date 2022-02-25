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

@Controller('links')
export class LinksController {
  constructor(private readonly service: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createLinkDto: CreateLinkDto) {
    const { userId } = req.user;
    return this.service.create(userId, createLinkDto);
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
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
