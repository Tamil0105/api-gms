import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';



@Injectable()
export class StorageServiceS3 {
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region:  process.env.AWS_REGION,
    });
  }

  // Upload a file to S3
  async upload(params: AWS.S3.PutObjectRequest): Promise<AWS.S3.ManagedUpload.SendData> {
    return this.s3.upload(params).promise();
  }

  // Delete a file from S3
  async delete(params: AWS.S3.DeleteObjectRequest): Promise<AWS.S3.DeleteObjectOutput> {
    return this.s3.deleteObject(params).promise();
  }

  // Optionally, you can implement a method to get the file (e.g., for validation purposes)
  async getObject(params: AWS.S3.GetObjectRequest): Promise<AWS.S3.GetObjectOutput> {
    return this.s3.getObject(params).promise();
  }
}
