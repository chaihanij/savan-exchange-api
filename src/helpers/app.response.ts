import { AppStatusMessage } from './app-status-message';
import { ApiProperty } from '@nestjs/swagger';

export class AppResponse {
  @ApiProperty({
    description: 'The status code of response',
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    description: 'The status message of response',
    example: 'OK',
  })
  statusMessage: string;

  @ApiProperty({
    description: 'The message of response',
    example: 'Successfully retrieved users',
  })
  message: any;

  constructor(statusCode: number, message: any) {
    this.statusCode = statusCode;
    this.statusMessage = AppStatusMessage[statusCode];
    this.message = message;
  }
}