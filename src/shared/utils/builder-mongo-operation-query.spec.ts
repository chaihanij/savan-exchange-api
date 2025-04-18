import { BuilderMongoOperationQuery } from './builder-mongo-operation-query';

describe('BuilderMongoOperationQuery', () => {
  const mockDto = {
    tenantId: 'abc123',
    plan: 'premium',
    status: 'active',
    search: 'exchange',
    orders: 'name,-createdAt',
    select: 'name,slug,status',
  };

  const builder = new BuilderMongoOperationQuery<typeof mockDto>(mockDto, ['name', 'description']);

  it('should build filters correctly', () => {
    const filters = builder.getFilters();
    expect(filters).toMatchObject({
      tenantId: 'abc123',
      plan: 'premium',
      status: 'active',
      $or: [{ name: { $regex: 'exchange', $options: 'i' } }, { description: { $regex: 'exchange', $options: 'i' } }],
    });
  });

  it('should extract sort orders correctly', () => {
    const sort = builder.getOrders(['name', 'createdAt']);
    expect(sort).toEqual({ name: 'asc', createdAt: 'desc' });
  });

  it('should extract select fields correctly', () => {
    const select = builder.getSelect();
    expect(select).toEqual({
      name: 1,
      slug: 1,
      status: 1,
    });
  });

  it('should return undefined for invalid or empty values', () => {
    const builderEmpty = new BuilderMongoOperationQuery({}, []);
    expect(builderEmpty.getOrders()).toBeUndefined();
    expect(builderEmpty.getSelect()).toBeUndefined();
    expect(builderEmpty.getFilters()).toEqual({});
  });

  describe('getPagination', () => {
    it('should return pagination object when both limit and skip are present', () => {
      const builder = new BuilderMongoOperationQuery({ limit: 20, skip: 10 });
      expect(builder.getPagination()).toEqual({ limit: 20, skip: 10 });
    });

    it('should return undefined if limit is missing', () => {
      const builder = new BuilderMongoOperationQuery({ skip: 5 });
      expect(builder.getPagination()).toBeUndefined();
    });

    it('should return undefined if skip is missing', () => {
      const builder = new BuilderMongoOperationQuery({ limit: 20 });
      expect(builder.getPagination()).toBeUndefined();
    });

    it('should work if skip = 0 (valid)', () => {
      const builder = new BuilderMongoOperationQuery({ limit: 20, skip: 0 });
      expect(builder.getPagination()).toEqual({ limit: 20, skip: 0 });
    });
  });
  
  describe('BuilderMongoOperationQuery.parseAdvancedFilters', () => {
    it('should parse equality filter', () => {
      const filters = ['status=active'];
      const result = BuilderMongoOperationQuery['parseAdvancedFilters'](filters);
      expect(result).toEqual({
        status: { $eq: 'active' },
      });
    });

    it('should parse inequality (!=)', () => {
      const filters = ['type!=admin'];
      const result = BuilderMongoOperationQuery['parseAdvancedFilters'](filters);
      expect(result).toEqual({
        type: { $ne: 'admin' },
      });
    });

    it('should parse greater than and less than', () => {
      const filters = ['createdAt>2023-01-01', 'age<50'];
      const result = BuilderMongoOperationQuery['parseAdvancedFilters'](filters);
      expect(result).toEqual({
        createdAt: { $gt: '2023-01-01' },
        age: { $lt: '50' },
      });
    });

    it('should parse in and nin', () => {
      const filters = ['role=in:user,admin', 'status=nin:banned,inactive'];
      const result = BuilderMongoOperationQuery['parseAdvancedFilters'](filters);
      expect(result).toEqual({
        role: { $in: ['user', 'admin'] },
        status: { $nin: ['banned', 'inactive'] },
      });
    });

    it('should handle multiple operators on same field', () => {
      const filters = ['age>18', 'age<60'];
      const result = BuilderMongoOperationQuery['parseAdvancedFilters'](filters);
      expect(result).toEqual({
        age: { $gt: '18', $lt: '60' },
      });
    });

    it('should ignore invalid filter format', () => {
      const filters = ['invalidfilter', 'key'];
      const result = BuilderMongoOperationQuery['parseAdvancedFilters'](filters);
      expect(result).toEqual({});
    });

    it('should ignore unknown operators', () => {
      const filters = ['field!==value']; // !== not supported
      const result = BuilderMongoOperationQuery['parseAdvancedFilters'](filters);
      expect(result).toEqual({});
    });
  });
});
