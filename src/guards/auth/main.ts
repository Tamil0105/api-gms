import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtDecode from 'jwt-decode';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { CacheService } from 'src/lib/cache/main';
import { User } from 'src/entity';
import { CurrentUserService } from '../../../utils/currentUser/main';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  private userRepository;

  constructor(
    private jwtService: JwtService,
    private currentUser: CurrentUserService,
    private cache: CacheService,
    private dataSource: DataSource // Inject DataSource
  ) {
    this.userRepository = this.dataSource.getRepository(User); // Get User repository
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const payload = this.getUserIdFromToken(token);

    if (!payload) throw new UnauthorizedException();
    const cachedUser = await this.cache.get(payload) as User;

    if (cachedUser) {
      this.currentUser.set = cachedUser;
      return true;
    }

    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(payload)
      }
    });
    console.log(user)

    if (!user) {
      throw new UnauthorizedException();
    }

    const newAuthUser: User = {
      id: user.id,
      username: user.username,
      password: user.password,
      emailVerified:user.emailVerified,
      email: user.email,
      phone: user.phone,
      generateId: function (): void {
        throw new Error('Function not implemented.');
      }
    };
    
    await this.cache.set({ key: JSON.stringify(user.id), payload: newAuthUser });
    this.currentUser.set = newAuthUser;
    return true;
  }

  getUserIdFromToken<T = string>(token: string): T | null {
    try {
      if (!token) return null;

      const payload = jwt.decode(token) as any;
      const subId = payload?.sub ?? null;

      return subId ? subId : null;
    } catch (err) {
      return null;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
