
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: any;
  constructor() {
    this.resend = new Resend('re_DGPuGWDS_QK9YmLVXsLe1LXbwfT2y8Kmz')
  }
  

  async sendEmail(to: string, subject: string, body: string): Promise<any> {

    try {
      //  const resend = new Resend('re_CqJemkqa_DYTuCGLd44KoiJhDd5YkQrCL'); // Initialize Resend instance
      const mailOptions = {
        from: "contact@gameonsolution.in", // Sender's email address
        to: to, // Recipient's email address
        subject: subject, // Subject line
        html: body, // HTML content
      };

      const result = await this.resend.emails.send(mailOptions); // Correct usage of resend
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
