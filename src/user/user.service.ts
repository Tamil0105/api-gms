import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { Authenticate } from 'src/guards/auth/decorator';
import { MailService } from 'src/lib/mailService';
import { Repository } from 'typeorm';
import { CurrentUserService } from 'utils/currentUser/main';

@Injectable()
@Authenticate()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailerService: MailService,
    private currentUser: CurrentUserService,
  ) {}

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.userRepository.findOne({ where: { id } });
  }
  async verifyEmail(mail: string, token: string) {
console.log(this.currentUser.get.id,"ppppppppppppp")

    const user = await this.userRepository.findOne({
      where: { id: this.currentUser.get.id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    user.email = mail
    user.emailVerified = false;

    await this.userRepository.save(user);

    let link = `http://localhost:5173/verify-mail?token=${token}` as string;

    await this.mailerService.sendEmail(`${mail}`, 'Hello from Postmark', link);

    return { message: 'Email verified successfully' };
  }
  async verifiedEmail(token: string) {

    console.log(token, 'pp');

    // Step 1: Verify the token and find the user associated with it
    const user = await this.userRepository.findOne({
      where: { id: parseInt(this.currentUser.get.id as any) },
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    // Step 2: Update the user's email
    user.emailVerified = true;
    // Update the email to the new email
    await this.userRepository.save(user); // Save the updated user
    return { message: 'Email verified and updated successfully' };
  }
}
