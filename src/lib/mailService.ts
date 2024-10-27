
import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private ses: AWS.SES;

  constructor() {
    this.ses = new AWS.SES({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region:  process.env.AWS_REGION,
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<any> {
console.log(to,"pp")
    const params = {
      Source: 'tamil16399@gmail.com',
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    };
    try {
      const result = await this.ses.sendEmail(params).promise();
      return result;
    } catch (error) {
    console.log(error)
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
