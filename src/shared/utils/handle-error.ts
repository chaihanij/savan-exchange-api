import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export function handleError(error: any, message: string) {
  if (error instanceof AppException) {
    throw error;
  } else {
    throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
