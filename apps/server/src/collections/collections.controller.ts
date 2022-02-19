import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('collections')
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req) {
    return this.service.create({
      userId: req.user.userId,
      ...req.body,
    });
  }
}
