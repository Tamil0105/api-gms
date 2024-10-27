import { Module } from '@nestjs/common';
import { ImageUploadService } from './imageUpload.service';
import { ImageUploadController } from './imageUplod.controller';


@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
})
export class ImageUploadModule {}
