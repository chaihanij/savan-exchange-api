import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppException } from '../shared/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Missing token');
      throw new AppException(HttpStatus.UNAUTHORIZED, 'Token not found');
    }

    try {
      const payload = await this.authService.verifyToken(token); // ✅ async รองรับกรณี future ใช้ Firebase หรือ JWK
      request.user = payload;
      return true;
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error?.message || error}`);
      throw new AppException(HttpStatus.UNAUTHORIZED, 'Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader || typeof authHeader !== 'string') return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
