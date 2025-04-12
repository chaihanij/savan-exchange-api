import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppException } from '../helpers';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new AppException(HttpStatus.UNAUTHORIZED, `token not found`);
    }

    try {
      request.user = this.authService.verifyToken(token);
      return true;
    } catch (e) {
      throw new AppException(HttpStatus.UNAUTHORIZED, `invalid token`);
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
