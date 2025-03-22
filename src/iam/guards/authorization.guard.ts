import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { AppException } from '../../helpers/';
import { USER_NOT_FOUND } from '../user/user.constant';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  logger = new Logger(AuthorizationGuard.name);

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.userId) {
      throw new AppException(HttpStatus.UNAUTHORIZED, USER_NOT_FOUND);
    }

    return true;
  }
}
