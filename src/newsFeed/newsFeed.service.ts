import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsFeed } from '../entity/news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsFeedService {
  constructor(
    @InjectRepository(NewsFeed)
    private newsFeedRepository: Repository<NewsFeed>,
  ) {}

  // Create a new newsfeed entry
  create(newsFeedData: Partial<NewsFeed>): Promise<NewsFeed> {
    const newsFeed = this.newsFeedRepository.create(newsFeedData);
    return this.newsFeedRepository.save(newsFeed);
  }

  // Get all newsfeed entries
  findAll(): Promise<NewsFeed[]> {
    return this.newsFeedRepository.find();
  }

  // Get one newsfeed by id
  findOne(id: number): Promise<NewsFeed> {
    return this.newsFeedRepository.findOne({ where: { id } });
  }

  // Update a newsfeed entry
  async update(id: number, updateData: Partial<NewsFeed>): Promise<NewsFeed> {
    await this.newsFeedRepository.update(id, updateData);
    return this.newsFeedRepository.findOne({ where: { id } });
  }

  // Delete a newsfeed entry
  delete(id: number): Promise<void> {
    return this.newsFeedRepository.delete(id).then(() => undefined);
  }
}
