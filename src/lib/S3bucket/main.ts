import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService extends S3 {
    [x: string]: any;
    constructor() {
        super({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
            region:  process.env.AWS_REGION,

        });
    }
}
// eu-north-1