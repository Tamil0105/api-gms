import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NewsFeedController } from './newsfeed.controller';
import { NewsFeed } from '../entity/news.entity';
import { NewsFeedService } from './newsFeed.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsFeed])],
  providers: [NewsFeedService],
  controllers: [NewsFeedController],
})
export class NewsFeedModule {}
