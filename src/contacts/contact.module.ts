import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from '../entity';
import { MailService } from '../lib/resendMailService';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserService } from '../../utils/currentUser/main';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [ContactService,MailService,JwtService,Repository,CurrentUserService],
})
export class ContactModule {}
