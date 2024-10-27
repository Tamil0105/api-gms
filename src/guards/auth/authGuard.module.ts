import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/lib/cache/main';
import { CurrentUserService } from '../../../utils/currentUser/main';
import { UserModule } from 'src/user/user.module'; // Import the module providing Repository
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { AuthGuard } from './main';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Ensure the User repository is defined here
    UserModule, // Or import the module that exports the User repository
  ],
  providers: [AuthGuard, JwtService, CacheService, CurrentUserService],
  exports: [AuthGuard],
})
export class AuthGuardModule {}
