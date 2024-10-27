import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from 'src/entity';
import { CreateContactDto } from './create-contact.dto';
import { Authenticate } from 'src/guards/auth/decorator';


@Controller('api/v1/contacts')
@Authenticate()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactService.createContact(createContactDto);
  }

  @Get()
  async getAllContacts(
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit 10
  ): Promise<{ contacts: Contact[]; unreadCount: number; unreadIds: number[]; totalContacts: number }> {
    return this.contactService.getAllContacts(page, limit);
  }
  @Patch()
  async updateReadStatus(@Body() updateDto: { ids: number[]; isRead: boolean }) {
    return this.contactService.updateReadStatus(updateDto.ids, updateDto.isRead);
  }
}
