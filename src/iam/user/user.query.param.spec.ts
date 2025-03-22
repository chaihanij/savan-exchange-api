import { UserQueryParam } from './user-query-param';

describe('UserQueryParam', () => {
  it('should be defined', () => {
    const userQueryParam = new UserQueryParam();
    expect(userQueryParam).toBeDefined();
  });

  it('should return sort order undefined', () => {
    const userQueryParam = new UserQueryParam();
    expect(userQueryParam.getUserSortOrder()).toBeUndefined();
  });

  it('should return sort order', () => {
    const userQueryParam = new UserQueryParam();
    userQueryParam.orders = 'createdAt,-updatedAt,username';
    expect(userQueryParam.getUserSortOrder()).toEqual({
      createdAt: 1,
      updatedAt: -1,
    });
  });

  it('should return filter', () => {
    const userQueryParam = new UserQueryParam();
    userQueryParam.uuid = 'uuid';
    userQueryParam.username = 'username';
    userQueryParam.email = 'email';
    userQueryParam.accountType = 1;
    
    expect(userQueryParam.getFilter()).toEqual({
      uuid: 'uuid',
      username: 'username',
      email: 'email',
      accountType: 1,
    });
  });
  
  it('should get pagination', () => {
    const userQueryParam = new UserQueryParam();
    userQueryParam.page = 1;
    userQueryParam.pageSize = 10;
    
    expect(userQueryParam.getPagination()).toEqual({
      limit: 10,
      skip: 0,
    });
  });
});
