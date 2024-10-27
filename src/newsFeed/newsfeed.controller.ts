import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NewsFeed } from '../entity/news.entity';
import { NewsFeedService } from './newsFeed.service';


@Controller('/api/v1/newsfeed')
export class NewsFeedController {
  constructor(private readonly newsFeedService: NewsFeedService) {}

  @Post()
  create(@Body() newsFeedData: Partial<NewsFeed>): Promise<NewsFeed> {
    return this.newsFeedService.create(newsFeedData);
  }

  @Get()
  findAll(): Promise<NewsFeed[]> {
    return this.newsFeedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<NewsFeed> {
    return this.newsFeedService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<NewsFeed>): Promise<NewsFeed> {
    return this.newsFeedService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.newsFeedService.delete(id);
  }
}
