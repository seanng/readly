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
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req) {
    return this.linksService.create({
      userId: req.user.userId,
      ...req.body,
    });
  }

  @Get()
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(+id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
