import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'src/entity';
import { Repository } from 'typeorm';
import { CreateContactDto } from './create-contact.dto';
import { MailService } from 'src/lib/mailService';
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
    const { email, phone } = createContactDto;

    // Check if a contact with the same email or phone already exists
    const existingContact = await this.contactRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (existingContact) {
      throw new ForbiddenException('Contact with this email or phone already exists');
    }

    const contact = this.contactRepository.create(createContactDto);
    await this.contactRepository.save(contact);

    // Send email notification after contact is created
    // await this.mailerService.sendContactCreatedEmail(email);

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
