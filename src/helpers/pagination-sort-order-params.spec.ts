import { PaginationSortOrderParams } from './pagination-sort-order-params';

describe('PaginationSortOrderParams', () => {
  let paginationSortOrderParams: PaginationSortOrderParams;

  beforeEach(() => {
    paginationSortOrderParams = new PaginationSortOrderParams();
  });

  it('should be defined', () => {
    expect(paginationSortOrderParams).toBeDefined();
  });

  it('should return default page when page is not set', () => {
    expect(paginationSortOrderParams.getPage()).toBe(1);
  });

  it('should return default pageSize when pageSize is not set', () => {
    expect(paginationSortOrderParams.getPageSize()).toBe(10);
  });

  it('should return correct page when page is set', () => {
    paginationSortOrderParams.page = 5;
    expect(paginationSortOrderParams.getPage()).toBe(5);
  });

  it('should return correct pageSize when pageSize is set', () => {
    paginationSortOrderParams.pageSize = 20;
    expect(paginationSortOrderParams.getPageSize()).toBe(20);
  });

  it('should return correct pagination', () => {
    paginationSortOrderParams.page = 3;
    paginationSortOrderParams.pageSize = 15;
    const params = paginationSortOrderParams.getPagination();
    expect(params).toEqual({
      skip: 30,
      limit: 15,
    });
  });

  it('should return correct sort order', () => {
    paginationSortOrderParams.orders = 'name,-age';
    const sortOrder = paginationSortOrderParams.getSortOrder();
    console.log(sortOrder);
  });
});
