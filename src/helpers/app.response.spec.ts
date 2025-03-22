import { AppResponse } from './app.response';

describe('AppResponse', () => {
  let appResponse: AppResponse;
  beforeAll(() => {
    appResponse = new AppResponse(200, 'Resource found');
  });
  it('should be defined', () => {
    expect(appResponse).toBeDefined();
  });

  it('should return correct status', () => {
    expect(appResponse.statusCode).toBe(200);
  });

  it('should return correct status message', () => {
    expect(appResponse.statusMessage).toBe('OK');
  });

  it('should return correct message', () => {
    expect(appResponse.message).toBe('Resource found');
  });
});
