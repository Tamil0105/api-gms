import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { S3StorageServiceModule } from './lib/S3bucket';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contacts/contact.module';
import { ImageUploadModule } from './imageUpload/imageUpload.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { NewsFeedModule } from './newsFeed/newsfeed.module';
import { CacheModule } from './lib/cache';
import { AuthGuardModule } from './guards/auth/authGuard.module';
import { User } from './entity';
import { UserModule } from './user/user.module';
import { CarouselModule } from './carousel/carousel.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    TypeOrmModule.forFeature([User]), // Ensure your entity is included here
    CacheModule,
    AuthModule,
    UserModule,
    ContactModule,
    ImageUploadModule,
    TestimonialsModule,
    S3StorageServiceModule,
    NewsFeedModule,
    CarouselModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
