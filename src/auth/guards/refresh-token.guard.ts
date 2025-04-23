import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { AppException } from '../../shared/utils';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const cookies = request.cookies;
      const refreshToken = cookies['refreshToken'];
      if (!refreshToken) {
        throw new AppException(HttpStatus.UNAUTHORIZED, 'Token not found');
      }
      request.user = this.authService.verify(refreshToken);
      return true;
    } catch (e) {
      if (e instanceof AppException) {
        throw e;
      } else {
        const msg = e.message || `${RefreshTokenGuard.name} unknown error`;
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, msg);
      }
    }
  }
}
