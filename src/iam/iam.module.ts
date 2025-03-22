import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { OrgModule } from './org/org.module';

@Module({
  imports: [AuthModule, UserModule, RoleModule, OrgModule],
})
export class IamModule {}
