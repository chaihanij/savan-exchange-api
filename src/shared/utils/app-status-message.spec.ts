import { AppStatusMessage } from './app-status-message';
import { HttpStatus } from '@nestjs/common';

describe('AppStatusMessage', () => {
  it('should be get app status message', () => {
    expect(AppStatusMessage[HttpStatus.OK]).toBe('OK');
  });
});
