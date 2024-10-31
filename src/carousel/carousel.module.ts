import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { Carousel } from '../entity/carouselImage';

@Module({
  imports: [TypeOrmModule.forFeature([Carousel])],
  controllers: [CarouselController],
  providers: [CarouselService],
})
export class CarouselModule {}
