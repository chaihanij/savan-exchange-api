import { RoleQueryParam } from './role.query.param';

describe('OrgQueryParam', () => {
  it('should be defined', () => {
    expect(new RoleQueryParam()).toBeDefined();
  });

  it('should be get filter', () => {
    const orgQueryParam = new RoleQueryParam();
    orgQueryParam.uuid = 'uuid';
    expect(orgQueryParam.getFilter()).toEqual({ uuid: 'uuid' });
  });

  it('should be get role sort order', () => {
    const orgQueryParam = new RoleQueryParam();
    orgQueryParam.orders = 'name';
    expect(orgQueryParam.getRoleSortOrder()).toEqual({ name: 1 });
  });
});
