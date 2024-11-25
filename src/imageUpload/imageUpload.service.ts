import { Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { StorageServiceS3 } from '../lib/S3bucket/s3';
import  * as sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://flfrfjdlsdhjupowgrxb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZnJmamRsc2RoanVwb3dncnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1MTAzMjAsImV4cCI6MjA0ODA4NjMyMH0.PraqqL7rDOkvf8PQCtPVYQAZBtK5EubNywRMbbjZ4QQ';
const supabase = createClient(supabaseUrl, supabaseKey);

@Injectable()
export class ImageUploadService {
  constructor(private readonly s3: StorageServiceS3) {}

  // Upload a new image to S3

 
async createImage(param: { file: any; folderKey: string }) {
  try {
    const { file } = param;
    const fileId = randomBytes(10).toString('hex');
    const isImage = file.mimetype.startsWith('image/');
    const Key = `${param.folderKey}/${fileId}${isImage ? '.webp' : ''}`;

    let fileBuffer = file.buffer;
    let contentType = file.mimetype;

    // Apply compression only for images
    if (isImage) {
      console.log(1)
      fileBuffer = await sharp(file.buffer)
        .webp({ quality: 80 }) // Compress and convert to WebP
        .toBuffer();
      contentType = 'image/webp'; // Update content type for WebP
      console.log(2)
    }

    // const res = await this.s3.upload({
    //   Bucket: 'landing-page-imgg',
    //   Key,
    //   Body: fileBuffer,
    //   ContentType: contentType,
    // });
    // console.log(res)
    const { data, error } = await supabase.storage
    .from('gms') // Replace 'images' with your bucket name
    .upload(`public/${Key}`, fileBuffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: contentType,

    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // console.log('File uploaded successfully:', data);
  // return data.path;
    return {
      created: true,
      url: `https://flfrfjdlsdhjupowgrxb.supabase.co/storage/v1/object/${data.fullPath}`,
    };
  } catch (error) {
    console.log("500")
    console.error('File upload error:', JSON.stringify(error));
    return error

    // throw new BadRequestException('Error uploading the file');
  }
}

  // async createImage(param: { file: any; folderKey: string }) {
  //   try {
  //     const { file } = param;
  //     const fileId = randomBytes(10).toString('hex');
  //     const Key = `${param.folderKey}/${fileId}`;

  //     const res = await this.s3.upload({
  //       Bucket: 'landing-page-imgg',
  //       Key,
  //       Body: file.buffer,
  //       ContentType: file.mimetype,
  //     });

  //     return {
  //       created: true,
  //       url: `https://landing-page-imgg.s3.eu-north-1.amazonaws.com/${Key}`,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException('Error uploading the image');
  //   }
  // }

  // Delete an image from S3
  async deleteImage(param: { folderKey: string; fileKey: string }) {
    try {
      const Key = `${param.folderKey}/${param.fileKey}`;
      // await this.s3.delete({
      //   Bucket: 'landing-page-imgg',
      //   Key,
      // });
      // return { deleted: true };
      const { data, error } = await supabase.storage
      .from("gms")
      .remove([`public/banner-img/${param.fileKey}`]); // Accepts an array of file paths
  
    if (error) {
      console.error('Error deleting file:', error.message);
      return null;
    }
  
    // console.log('File deleted successfully:', data);
    return data;
    } catch (error) {
      throw new BadRequestException('Error deleting the image');
    }
  }

  // Update (replace) an existing image in S3
  async updateImage(param: { file: any; folderKey: string; oldKey: string }) {
    try {
      const { file } = param;
    // const fileId = randomBytes(10).toString('hex');
    const isImage = file.mimetype.startsWith('image/');
    // const Key = `${param.folderKey}/${param.oldKey}`;

    let fileBuffer = file.buffer;
    let contentType = file.mimetype;

    // Apply compression only for images
   

    // const res = await this.s3.upload({
    //   Bucket: 'landing-page-imgg',
    //   Key,
    //   Body: fileBuffer,
    //   ContentType: contentType,
    // });
    // console.log(res)
  
      if (isImage) {
        console.log(1)
        fileBuffer = await sharp(file.buffer)
          .webp({ quality: 80 }) // Compress and convert to WebP
          .toBuffer();
        contentType = 'image/webp'; // Update content type for WebP
        console.log(2)
      }
          // Delete the old image
    const deleteResponse = await this.deleteImage({
      fileKey: param.oldKey,
      folderKey: param.folderKey,
    });
    if (!deleteResponse) {
      // console.error('Failed to delete the old image.');
      return { created: false, message: 'Failed to delete old image' };
    }

    // Upload the new image
    const { data, error } = await supabase.storage
      .from("gms")
      .upload(`public/banner-img/${param.oldKey}`, fileBuffer, {
        cacheControl: '3600',
        upsert: true, // Set to true to overwrite the existing file
        contentType: 'image/jpeg', // Update based on your file type
      });

    if (error) {
      console.error('Error updating file:', error.message);
      return { created: false, message: 'Error uploading file' };
    }

    console.log('File updated successfully:', data);
    return {
      created: true,
      url: `https://flfrfjdlsdhjupowgrxb.supabase.co/storage/v1/object/public/banner-img/${param.oldKey}`,
    };
    } catch (error) {
      throw new BadRequestException('Error updating the image');
    }
  }
}
