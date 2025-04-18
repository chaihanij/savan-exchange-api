import { SortOrder } from 'mongoose';

export interface BuilderMongoOperationQueryOptions {
  equals?: Record<string, any>;
  searchFields?: string[];
  searchKeyword?: string;
}

export class BuilderMongoOperationQuery<T> {
  private readonly data: T;
  private readonly searchFields?: string[];
  private static readonly excludedKeys = ['search', 'skip', 'limit', 'orders', 'select'];

  constructor(data: T, searchFields?: string[]) {
    this.data = data;
    this.searchFields = searchFields;
  }

  private static filterEquals(data: Record<string, any>): Record<string, any> | undefined {
    const filterEquals = Object.entries(data)
      .filter(([key, value]) => !BuilderMongoOperationQuery.excludedKeys.includes(key) && value != null)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

    return Object.keys(filterEquals).length > 0 ? filterEquals : undefined;
  }

  private static parseAdvancedFilters(filterStrings: string[] = []): Record<string, any> {
    const filters: Record<string, any> = {};

    for (const raw of filterStrings) {
      const match = raw.match(/^([a-zA-Z0-9_.]+)(!?=|>=|<=|>|<|=|in:|nin:)(.+)$/);
      if (!match) continue;

      let [, field, operator, rawValue] = match;
      let value: any = rawValue.trim();

      // support array in in/nin
      if (operator.includes('in:')) {
        value = value.split(',').map(v => v.trim());
      }

      const mongoOp = (() => {
        switch (operator) {
          case '=':
            return '$eq';
          case '!=':
            return '$ne';
          case '>':
            return '$gt';
          case '>=':
            return '$gte';
          case '<':
            return '$lt';
          case '<=':
            return '$lte';
          case 'in:':
            return '$in';
          case 'nin:':
            return '$nin';
          default:
            return undefined;
        }
      })();

      if (!mongoOp) continue;

      if (!filters[field]) filters[field] = {};
      filters[field][mongoOp] = value;
    }

    return filters;
  }

  buildOptions(): BuilderMongoOperationQueryOptions {
    const equals = BuilderMongoOperationQuery.filterEquals(this.data as Record<string, any>);
    return {
      equals,
      searchKeyword: (this.data as any).search,
      searchFields: this.searchFields,
    };
  }

  getFilters(): Record<string, any> {
    const { equals, searchFields, searchKeyword } = this.buildOptions();
    const filters: Record<string, any> = { ...equals };

    if (searchFields && searchKeyword) {
      const regex = { $regex: searchKeyword, $options: 'i' };
      filters.$or = searchFields.map(field => ({ [field]: regex }));
    }

    const advancedFilter = (this.data as any).filters;
    if (Array.isArray(advancedFilter)) {
      const advanced = BuilderMongoOperationQuery.parseAdvancedFilters(advancedFilter);
      Object.assign(filters, advanced);
    }

    return filters;
  }

  getOrders(allowedFields?: string[]): Record<string, SortOrder> | undefined {
    const orders = (this.data as any).orders;
    if (!orders) return undefined;

    const sortOrder: Record<string, SortOrder> = {};
    const ordersArray = Array.isArray(orders) ? orders : orders.split(',');
    for (const order of ordersArray) {
      const direction = order.startsWith('-') ? 'desc' : 'asc';
      const field = order.replace(/^-/, '').trim();
      if (!field) continue;
      if (allowedFields && !allowedFields.includes(field)) continue;
      sortOrder[field] = direction;
    }
    return Object.keys(sortOrder).length > 0 ? sortOrder : undefined;
  }

  getSelect(): Record<string, 1> | undefined {
    const selectRaw = (this.data as any).select;
    if (!selectRaw) return undefined;

    const selectArray = Array.isArray(selectRaw) ? selectRaw : selectRaw.split(',');
    const fields = selectArray.map((field: string) => field.trim()).filter(Boolean);

    return fields.reduce((acc: Record<string, 1>, field: string) => {
      acc[field] = 1;
      return acc;
    }, {});
  }

  getPagination(): { limit: number; skip: number } | undefined {
    const limit = (this.data as any).limit;
    const skip = (this.data as any).skip;

    if (typeof limit !== 'number' || typeof skip !== 'number') {
      return undefined;
    }

    return { limit, skip };
  }
}
