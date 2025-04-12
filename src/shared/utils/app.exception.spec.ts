import { AppException } from './app.exception';

describe('AppException', () => {
  let appException: AppException;
  beforeAll(() => {
    appException = new AppException(404, 'Resource not found');
  });
  it('should be defined', () => {
    expect(appException).toBeDefined();
  });

  it('should return correct status', () => {
    expect(appException.getStatus()).toBe(404);
  });
});
