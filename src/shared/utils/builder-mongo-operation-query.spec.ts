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
});
