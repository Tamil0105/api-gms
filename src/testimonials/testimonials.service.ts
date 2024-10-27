import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from 'src/entity/testimonials.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  async create(data: Partial<Testimonial>): Promise<Testimonial> {
    console.log(data)
    const testimonial = this.testimonialRepository.create({
      ...data,
    });
    return this.testimonialRepository.save(testimonial);
  }

  async findAll(): Promise<Testimonial[]> {
    return this.testimonialRepository.find();
  }

  async findOne(id: number): Promise<Testimonial> {
    return this.testimonialRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Testimonial>): Promise<Testimonial> {
    console.log(data,"pp")
   const up =  await this.testimonialRepository.update(id, data);
   console.log(up,"op")
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.testimonialRepository.delete(id);
  }
}
