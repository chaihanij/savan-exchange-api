import { OrgQueryParam } from './org.query.param';

describe('OrgQueryParam', () => {
  it('should be defined', () => {
    expect(new OrgQueryParam()).toBeDefined();
  });

  it('should be get filter', () => {
    const orgQueryParam = new OrgQueryParam();
    orgQueryParam.uuid = 'uuid';
    expect(orgQueryParam.getFilter()).toEqual({ uuid: 'uuid' });
  });

  it('should be get org sort order', () => {
    const orgQueryParam = new OrgQueryParam();
    orgQueryParam.orders = 'name';
    expect(orgQueryParam.getOrgSortOrder()).toEqual({ name: 1 });
  });
});
