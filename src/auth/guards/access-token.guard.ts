import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AppException } from '../../shared/utils';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(AccessTokenGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessToken(request);

    if (!accessToken) {
      throw new AppException(HttpStatus.UNAUTHORIZED, 'Token not found');
    }

    try {
      request.user = await this.authService.verify(accessToken);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  private extractAccessToken(request: any): string | null {
    const tokenFromCookie = request.cookies?.accessToken;
    const tokenFromHeader = request.headers['authorization']?.startsWith('Bearer ')
      ? request.headers['authorization'].split(' ')[1]
      : null;

    return tokenFromCookie || tokenFromHeader;
  }

  private handleError(error: any): never {
    if (error instanceof AppException) {
      throw error;
    }

    const errorMessage = error.message || `${AccessTokenGuard.name} unknown error`;
    this.logger.error(errorMessage);
    throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
  }
}