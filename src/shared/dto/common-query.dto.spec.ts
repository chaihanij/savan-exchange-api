import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CommonQueryDto } from './common-query.dto';

describe('CommonQueryDto', () => {
  it('should parse orders correctly', () => {
    const dto = plainToInstance(CommonQueryDto, { orders: 'name,-createdAt' });
    const result = dto.getOrders();
    expect(result).toEqual({ name: 'asc', createdAt: 'desc' });
  });

  it('should parse select fields correctly', () => {
    const dto = plainToInstance(CommonQueryDto, { select: 'name,email' });
    const result = dto.getSelectedFields();
    expect(result).toEqual({ name: 1, email: 1 });
  });

  it('should parse filters as array from string', () => {
    const dto = plainToInstance(CommonQueryDto, {
      filters: 'status=in:active,pending;age>18',
    });
    expect(dto.filters).toEqual(['status=in:active,pending', 'age>18']);
  });

  it('should default pagination when values are missing', () => {
    const dto = plainToInstance(CommonQueryDto, {});
    expect(dto.getPagination()).toEqual({ skip: 0, limit: 10 });
  });

  it('should respect skip and limit if provided', () => {
    const dto = plainToInstance(CommonQueryDto, { skip: '20', limit: '50' });
    const pagination = dto.getPagination();
    expect(pagination).toEqual({ skip: 20, limit: 50 });
  });

  it('should pass validation with valid data', () => {
    const dto = plainToInstance(CommonQueryDto, {
      search: 'test',
      select: 'name,email',
      skip: 0,
      limit: 10,
    });
    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  describe('CommonQueryDto - getFilters', () => {
    it('should return filters as an array when filters are provided', () => {
      const dto = plainToInstance(CommonQueryDto, {
        filters: 'status=in:active,pending;age>18',
      });
      const result = dto.getFilters();
      expect(result).toEqual(['status=in:active,pending', 'age>18']);
    });

    it('should return undefined when no filters are provided', () => {
      const dto = plainToInstance(CommonQueryDto, {});
      const result = dto.getFilters();
      expect(result).toBeUndefined();
    });

    it('should return undefined when filters are not an array', () => {
      const dto = plainToInstance(CommonQueryDto, { filters: null });
      const result = dto.getFilters();
      expect(result).toBeUndefined();
    });
  });
});