import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CarouselService } from './carousel.service'
import { Carousel } from 'src/entity/carouselImage';
import { CreateCarouselDto, UpdateCarouselDto } from './carousel.dto';

@Controller('/api/v1/carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  async create(@Body() createCarouselDto: CreateCarouselDto): Promise<Carousel> {
    return this.carouselService.create(createCarouselDto);
  }

  @Get()
  async findAll(): Promise<Carousel[]> {
    return this.carouselService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<Carousel> {
  //   return this.carouselService.findOne(id);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateCarouselDto: UpdateCarouselDto,
  // ): Promise<Carousel> {
  //   return this.carouselService.update(id, updateCarouselDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.carouselService.remove(id);
  }
}
