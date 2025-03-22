import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppException } from '../../helpers/';
import { INVALID_TOKEN } from '../auth/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new AppException(HttpStatus.UNAUTHORIZED, INVALID_TOKEN);
    }

    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.uuid;
    } catch (error) {
      throw new AppException(HttpStatus.UNAUTHORIZED, INVALID_TOKEN);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
