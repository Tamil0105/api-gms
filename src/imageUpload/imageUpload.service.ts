import { Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { StorageServiceS3 } from '../lib/S3bucket/s3';

@Injectable()
export class ImageUploadService {
  constructor(private readonly s3: StorageServiceS3) {}

  // Upload a new image to S3
  async createImage(param: { file: any; folderKey: string }) {
    try {
      
      const { file } = param;
      const fileId = randomBytes(10).toString('hex');
      const Key = `${param.folderKey}/${fileId}`;

      const res = await this.s3.upload({
        Bucket: 'landing-page-imgg',
        Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      return {
        created: true,
        url: `https://landing-page-imgg.s3.eu-north-1.amazonaws.com/${Key}`,
      };
    } catch (error) {
      throw new BadRequestException('Error uploading the image');
    }
  }

  // Delete an image from S3
  async deleteImage(param: { folderKey: string; fileKey: string }) {
    try {
      const Key = `${param.folderKey}/${param.fileKey}`;
      await this.s3.delete({
        Bucket: 'landing-page-imgg',
        Key,
      });
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException('Error deleting the image');
    }
  }

  // Update (replace) an existing image in S3
  async updateImage(param: { file: any; folderKey: string; oldKey: string }) {
    try {
      const Key = `${param.folderKey}/${param.oldKey}`;

      // Replace the existing file by uploading a new one to the same key
      const res = await this.s3.upload({
        Bucket: 'landing-page-imgg',
        Key,
        Body: param.file.buffer,
        ContentType: param.file.mimetype,
      });

      return {
        updated: true,
        url: `https://landing-page-imgg.s3.eu-north-1.amazonaws.com/${Key}`,
      };
    } catch (error) {
      throw new BadRequestException('Error updating the image');
    }
  }
}
