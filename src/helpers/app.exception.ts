import { HttpException } from '@nestjs/common';
import { AppStatusMessage } from './app-status-message';

export class AppException extends HttpException {
  constructor(statusCode: number, message: any) {
    const statusMessage = AppStatusMessage[statusCode];
    super({ statusCode, statusMessage, message }, statusCode);
  }
}
