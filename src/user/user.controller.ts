import { Controller, Get, Post, Body, Param, Req, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entity';
import { Authenticate } from '../guards/auth/decorator';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('create')
  createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData);
  }
  @Authenticate()
  @Put(':id')
  updateUser(@Param('id') id: number,@Body() updateData: Partial<User>): Promise<User> {
    return this.userService.update(id,updateData);
  }
  @Authenticate()
  @Get(':id')
  getUser(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }
  @Authenticate()
  @Post('verify')
  async verifyEmail(@Req() request: Request,@Query() param:{email:string}) {
    const authHeader = request.headers['authorization'];
    let token: string;
  
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]; // Get the token part after 'Bearer '
    } else {
      throw new Error('Token not provided'); // Handle missing or invalid token
    }
    return this.userService.verifyEmail(param.email,token);
  }

  @Authenticate()
  @Post('verified')
  async verifiedMail(@Req() request: Request) {
    const authHeader = request.headers['authorization'];
    let token: string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]; // Get the token part after 'Bearer '
    } else {
      throw new Error('Token not provided'); // Handle missing or invalid token
    }    return this.userService.verifiedEmail(token);
  }
}
