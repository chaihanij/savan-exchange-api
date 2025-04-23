import { ApiProperty } from '@nestjs/swagger';
import { AccountWithRolesAndPoliciesDto, PolicyDto, RoleWithPoliciesDto } from '../../account/dto';

export class SignInResponseDto implements Readonly<AccountWithRolesAndPoliciesDto> {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ isArray: true, type: () => PolicyDto })
  policies: PolicyDto[];

  @ApiProperty({ isArray: true, type: () => RoleWithPoliciesDto })
  roles: RoleWithPoliciesDto[];

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  username: string;
}