import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../entity';
import { Repository } from 'typeorm';
import { CreateContactDto } from './create-contact.dto';
import { MailService } from '../lib/mailService';
import { CurrentUserService } from '../../utils/currentUser/main';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private mailerService: MailService,
    private currentUser :CurrentUserService // Inject the MailerService

  ) {}

  async createContact(createContactDto: CreateContactDto): Promise<Contact> {
  
  
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
          <h1>New User Alert: Welcome to Our Service!</h1>
        </div>
        <div class="content">
          <p>Hi Team,</p>
          <p>A new user has just joined our service! Here are their details:</p>
          <div class="user-details">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Signup Date:</strong> ${new Date().toDateString()}</p>
          </div>
          <p>To view more details about this user, click the button below:</p>
          <p><a href="https://example.com/users/12345" class="button">View User Profile</a></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Our Service, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
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
    // await this.mailerService.sendEmail(this.currentUser.get.email,'New user reached you',body);

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
