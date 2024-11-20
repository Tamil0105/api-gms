import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carousel } from '../entity/carouselImage';
import { Repository } from 'typeorm';
import { CreateCarouselDto, UpdateCarouselDto } from './carousel.dto';
import { StorageServiceS3 } from '../lib/S3bucket/s3';


@Injectable()
export class CarouselService {
  constructor(
    @InjectRepository(Carousel)
    private readonly carouselRepository: Repository<Carousel>,
    private readonly s3: StorageServiceS3
  ) {}

  async create(createCarouselDto: CreateCarouselDto): Promise<Carousel> {
    const carousel = this.carouselRepository.create(createCarouselDto);
    return this.carouselRepository.save(carousel);
  }

  async findAll(): Promise<Carousel[]> {
    return this.carouselRepository.find();
  }

  // async findOne(id: number): Promise<Carousel> {
  //   return this.carouselRepository.findOne(id);
  // }

  // async update(id: number, updateCarouselDto: UpdateCarouselDto): Promise<Carousel> {
  //   await this.carouselRepository.update(id, updateCarouselDto);
  //   return this.findOne(id);
  // }

  async remove(id: number): Promise<{ deleted: boolean }> {
    // Find the carousel item by ID
    const data = await this.carouselRepository.findOne({
      where: {
        id: id,
      },
    });
  
    // Throw an error if the data is not found
    if (!data) {
      throw new ForbiddenException("Data not found!");
    }
  
    // Extract the key from the URL
    const KeyOne = data.url.substring(data.url.lastIndexOf('/') + 1); // Adjust to get the correct key
    const KeyTwo = data.phoneUrl.substring(data.phoneUrl.lastIndexOf('/') + 1); // Adjust to get the correct key

  
    // Delete the object from the S3 bucket
    await this.s3.delete({
      Bucket: 'landing-page-imgg',
      Key:KeyOne,
    });
    await this.s3.delete({
      Bucket: 'landing-page-imgg',
      Key:KeyTwo,
    });
  
    await this.carouselRepository.delete(id);
  
    // Return an object indicating successful deletion
    return { deleted: true };
  }
  
}
