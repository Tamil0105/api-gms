import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from 'src/entity/testimonials.entity';

@Controller('/api/v1/testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  async create(@Body() body: Partial<Testimonial>): Promise<Testimonial> {
    console.log(body,1)
    return this.testimonialsService.create(body);
  }

  @Get()
  async findAll(): Promise<Testimonial[]> {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Testimonial> {
    return this.testimonialsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<Testimonial>): Promise<Testimonial> {
    return this.testimonialsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.testimonialsService.remove(id);
  }
}
