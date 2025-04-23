import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AppException } from '../../shared/utils';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const cookies = request.cookies;
      const accessToken = cookies['accessToken'];
      if (!accessToken) {
        throw new AppException(HttpStatus.UNAUTHORIZED, 'Token not found');
      }
      request.user = await this.authService.verify(accessToken);
      return true;
    } catch (e) {
      if (e instanceof AppException) {
        throw e;
      } else {
        const msg = e.message || `${AccessTokenGuard.name} unknown error`;
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, msg);
      }
    }
  }
}
