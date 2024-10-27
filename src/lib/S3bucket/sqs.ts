// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import AWS from 'aws-sdk';

// @Injectable()
// export class SQS_Client {
//     constructor(private config: ConfigService) {
//         AWS.config.update({
//             region: this.config.getOrThrow('AWS_REGION'),
//             accessKeyId: this.config.getOrThrow('AWS_ACCESS_KEY_ID'),
//             secretAccessKey: this.config.getOrThrow('AWS_SECRET_KEY'),
//         });
//     }
//     public S_Q_S = new AWS.SQS({ region: this.config.getOrThrow('AWS_REGION') });
// }
import AWS from 'aws-sdk';

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const SQS = new AWS.SQS({ region: process.env.AWS_REGION });
