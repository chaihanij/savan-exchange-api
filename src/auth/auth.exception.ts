import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED } from './auth.constant';

export const UnauthorizedException = (
  message: string | undefined,
): HttpException => {
  return new HttpException(
    {
      statusCode: HttpStatus.UNAUTHORIZED,
      statusMessage: UNAUTHORIZED,
      message: message || UNAUTHORIZED,
    },
    HttpStatus.UNAUTHORIZED,
  );
};
