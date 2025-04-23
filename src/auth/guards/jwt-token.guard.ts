import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AppException } from '../../shared/utils';

@Injectable()
export class JwtTokenGuard implements CanActivate {
  private readonly logger = new Logger(JwtTokenGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Missing token');
      throw new AppException(HttpStatus.UNAUTHORIZED, 'Token not found');
    }

    try {
      request.user = await this.authService.verify(token);
      return true;
    } catch (e) {
      if (e instanceof AppException) {
        throw e;
      } else {
        const msg = e.message || `${JwtTokenGuard.name} unknown error`;
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, msg);
      }
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader || typeof authHeader !== 'string') return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
