import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../entity';
import { Repository } from 'typeorm';
import { CreateContactDto } from './create-contact.dto';
import { MailService } from '../lib/resendMailService';
import { CurrentUserService } from '../../utils/currentUser/main';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private mailerService: MailService,
    private currentUser :CurrentUserService // Inject the MailerService

  ) {}

  async createContact(createContactDto: CreateContactDto): Promise<any> {
  
  
    const { email, phone,name } = createContactDto;

    const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container {
          font-family: Arial, sans-serif;
          color: #333;
          padding: 20px;
          background-color: #f7f7f7;
        }
        .header {
          background-color: #4CAF50;
          padding: 10px;
          text-align: center;
          color: #fff;
        }
        .content {
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #777;
          text-align: center;
          padding: 10px;
        }
        .button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
        .user-details {
          background-color: #e8f5e9;
          padding: 10px;
          border-radius: 5px;
        }
        .user-details p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>New User Alert!</h1>
        </div>
        <div class="content">
          <p>Hi Team,</p>
          <p>A new user has just joined our service! Here are their details:</p>
          <div class="user-details">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toDateString()}</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 Our Service, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const bodyForNewUser = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #ddd;
            color: #0f150e;
        }
        h2 {
            color: #0f150e;
            font-size: 24px;
        }
        p {
            margin: 10px 0;
            line-height: 1.6;
        }
        a {
            color: #0f150e;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Thank You for Contacting Us!</h2>
        <p>We’ve received your message and will get back to you shortly.</p>
        <p>If your request is urgent, please call us at <a href="tel:9715131313">9715131313</a>.</p>
        <p>You can also reach us via email at <a href="mailto:gameon.solution.317@gmail.com">gameon.solution.317@gmail.com</a>.</p>
        <p>Our Address:</p>
        <p>Seethammal Colony 2nd Cross St,<br>Lubdhi Colony, Alwarpet,<br>Chennai, Tamil Nadu 600018</p>
        <div class="footer">
            <p>© 2024 GameOn Solutions</p>
        </div>
    </div>
</body>
</html>
`
    // Check if a contact with the same email or phone already exists
    const existingContact = await this.contactRepository.findOne({
      where: [{ email }],
    });

    if (existingContact) {
      throw new ForbiddenException('Contact with this email or phone already exists');
    }

    const contact = this.contactRepository.create(createContactDto);
    await this.contactRepository.save(contact);

    // Send email notification after contact is created
    await this.mailerService.sendEmail(this.currentUser.get.email,'New user reached you',body);
    //email for new user
     await this.mailerService.sendEmail(email,'Thank you for contacting Us',bodyForNewUser);


    return this.contactRepository.save(contact);
  }
  async getAllContacts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    contacts: Contact[];
    unreadCount: number;
    unreadIds: number[];
    totalContacts: number;
    pageCount: number; // Add pageCount to the return type
  }> {
    try {
      // Calculate the offset for pagination
      const offset = (page - 1) * limit;
  
      // Get total contacts count
      const totalContacts = await this.contactRepository.count();
  
      // Fetch paginated contacts
      const contacts = await this.contactRepository.find({
        skip: offset,
        take: limit,
      });
  
      // Filter unread contacts
      const unreadContacts = contacts.filter(contact => !contact.isRead);
  
      // Get unreadCount and unreadIds
      const unreadCount = unreadContacts.length;
      const unreadIds = unreadContacts.map(contact => contact.id); // Extract IDs of unread contacts
  
      // Calculate the page count
      const pageCount = Math.ceil(totalContacts / limit); // Calculate page count
  
      return { contacts, unreadCount, unreadIds, totalContacts, pageCount };
    } catch (error) {
      throw new ForbiddenException('Error retrieving contacts');
    }
  }
  
  
  
    // Update read status for multiple contacts
    async updateReadStatus(ids: number[], isRead: boolean): Promise<Contact[]> {
      // Find the contacts with the provided IDs
      const contacts = await this.contactRepository.findByIds(ids);
  
      if (contacts.length === 0) {
        throw new BadRequestException('No contacts found for the provided IDs');
      }
  
      // Update the read status for each contact
      const updatedContacts = contacts.map(contact => {
        contact.isRead = isRead;
        return contact;
      });
  
      try {
        // Save the updated contacts
        return await this.contactRepository.save(updatedContacts);
      } catch (error) {
        throw new ForbiddenException('Error updating contact read statuses');
      }
    }
}
