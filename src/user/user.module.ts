import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { UserService } from './user.service';
import { CurrentUserService } from '../../utils/currentUser/main';
import { MailService } from 'src/lib/mailService';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers:[UserController],
  providers: [UserService,CurrentUserService,MailService,JwtService],
  exports: [UserService, TypeOrmModule,], // Export UserService so other modules can use it

})
export class UserModule {}
