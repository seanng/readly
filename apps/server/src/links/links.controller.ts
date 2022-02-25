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

@Controller('links')
export class LinksController {
  constructor(private readonly service: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req) {
    return this.service.create({
      userId: req.user.userId,
      ...req.body,
    });
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.service.update(+id, updateLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
