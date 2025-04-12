import { CommonQueryDto } from './common-query.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('CommonQueryDto', () => {
  let dto: CommonQueryDto;

  beforeEach(() => {
    dto = new CommonQueryDto();
  });

  it('should validate and transform correctly', async () => {
    const input = {
      search: 'test',
      orders: 'name,-createdAt',
      select: 'field1,field2',
      skip: '5',
      limit: '10',
    };

    // Transform a plain object to class instance
    const dto = plainToInstance(CommonQueryDto, input);

    // Validate the instance
    const errors = await validate(dto);

    // Ensure no validation errors
    expect(errors.length).toBe(0);

    // Check transformed values
    expect(dto.skip).toBe(5); // Transformed to number
    expect(dto.limit).toBe(10); // Transformed to number
    expect(dto.select).toEqual(['field1', 'field2']); // Transformed to array
  });

  it('should return validation errors for invalid input', async () => {
    const input = {
      search: 123, // Invalid type
      skip: -1, // Invalid value
      limit: 200, // Exceeds maximum
    };

    const dto = plainToInstance(CommonQueryDto, input);
    const errors = await validate(dto);

    // Ensure validation errors exist
    expect(errors.length).toBeGreaterThan(0);

    // Check specific validation errors
    const searchError = errors.find(e => e.property === 'search');
    expect(searchError).toBeDefined();
    expect(searchError?.constraints?.isString).toBeDefined();

    const skipError = errors.find(e => e.property === 'skip');
    expect(skipError).toBeDefined();
    expect(skipError?.constraints?.min).toBeDefined();

    const limitError = errors.find(e => e.property === 'limit');
    expect(limitError).toBeDefined();
    expect(limitError?.constraints?.max).toBeDefined();
  });

  describe('getOrders', () => {
    it('should return undefined if orders is not set', () => {
      expect(dto.getOrders()).toBeUndefined();
    });

    it('should return a valid sort order object', () => {
      dto.orders = 'name,-createdAt';
      const result = dto.getOrders();
      expect(result).toEqual({ name: 'asc', createdAt: 'desc' });
    });

    it('should filter out fields not in allowedFields', () => {
      dto.orders = 'name,-createdAt,invalidField';
      const result = dto.getOrders(['name', 'createdAt']);
      expect(result).toEqual({ name: 'asc', createdAt: 'desc' });
    });
  });

  describe('getSelectedFields', () => {
    it('should return undefined if select is not set', () => {
      expect(dto.getSelectedFields()).toBeUndefined();
    });

    it('should return a valid selected fields object', () => {
      dto.select = ['field1', 'field2'];
      const result = dto.getSelectedFields();
      expect(result).toEqual({ field1: 1, field2: 1 });
    });

    it('should ignore empty or invalid fields', () => {
      dto.select = ['field1', '', '  ', 'field2'];
      const result = dto.getSelectedFields();
      expect(result).toEqual({ field1: 1, field2: 1 });
    });
  });
});
