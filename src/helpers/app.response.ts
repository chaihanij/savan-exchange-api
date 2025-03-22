import { AppStatusMessage } from './app-status-message';

export class AppResponse {
  statusCode: number;
  statusMessage: string;
  message: any;

  constructor(statusCode: number, message: any) {
    this.statusCode = statusCode;
    this.statusMessage = AppStatusMessage[statusCode];
    this.message = message;
  }
}
