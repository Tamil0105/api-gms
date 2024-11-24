import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // Use TLS, set to true if port is 465
      auth: {
        user: "tamil16399@gmail.com", // Your email
        pass: "ojwg qgla qosv ljtw", // Your email password
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    try {
      const mailOptions = {
        from: "tamil16399@gmail.com", // Sender's email address
        to: to, // Recipient's email address
        subject: subject, // Subject line
        html: body, // HTML content
        text: body.replace(/<\/?[^>]+(>|$)/g, ""), // Plain text version
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
