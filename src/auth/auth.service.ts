import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      console.log(username, pass);
      const user = await this.userService.findByUsername(username);
      

      if(user.password===pass){
        const {...result} = user
                return result;

      }{
                throw new ForbiddenException ('Invalid credentials')

      }
      // Check if user exists and password matches
      // if (user && bcrypt.compareSync(pass, user.password)) {
      //   const { password, ...result } = user; 
      //   console.log(result)// Exclude password from result
      //   return result;
      // }{
      //   throw new ForbiddenException ('Invalid credentials')
      // }
return user
    } catch (error) {
      console.error('Error in validating user:', error); // Log the error
      throw new ForbiddenException('Error validating user credentials'); // Throw generic error
    }
  }

  async login(user: any) {
    console.log(user,'ss')
    const payload = { username: user.username, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    return this.userService.create({
      ...userData,
      password: hashedPassword,
    });
  }
}
