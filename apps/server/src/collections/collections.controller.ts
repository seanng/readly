import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionInput } from './collections.interface';

@Controller('collections')
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @Post()
  // TODO: replace jwt auth guard with cookie guard.
  async create(@Body() body: CollectionInput) {
    return this.service.create(body);
  }
}
