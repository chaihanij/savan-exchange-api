import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { AccountTypeEnum } from '../interfaces';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true, collection: 'roles' })
export class Role {
  @ApiProperty({ example: 'role-001', description: 'Unique role ID' })
  @Prop({ unique: true, default: () => randomUUID() })
  roleId: string;

  @ApiProperty({ example: 'tenant-001', description: 'Tenant ID' })
  @Prop({ default: null })
  tenantId: string;

  @ApiProperty({ example: 'Admin', description: 'Role name' })
  @Prop({ required: true })
  name: string;

  @ApiPropertyOptional({ example: 'Administrator with all permissions', description: 'Role description' })
  @Prop({ default: null })
  description?: string;

  @ApiProperty({ example: true, description: 'Is this a system-wide role?' })
  @Prop({ default: false })
  isSystemRole: boolean;

  @ApiProperty({ example: ['policy-1', 'policy-2'], description: 'List of policy IDs' })
  @Prop({ type: [String], default: [] })
  policyIds: string[];

  @ApiProperty({
    example: [AccountTypeEnum.Admin, AccountTypeEnum.Staff],
    enum: AccountTypeEnum,
    isArray: true,
    description: 'Account types this role can be assigned to',
  })
  @Prop({ type: [String], enum: AccountTypeEnum, default: [] })
  assignableTo: AccountTypeEnum[];

  @ApiProperty({ example: false })
  @Prop({ default: false, description: 'Soft delete flag' })
  isDeleted: boolean;

  @ApiProperty({ example: '2025-04-10T00:00:00.000Z', description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z', description: 'Last updated date' })
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.virtual('policies', {
  ref: 'Policy',
  localField: 'policyIds',
  foreignField: 'policyId',
  justOne: false,
});

RoleSchema.set('toJSON', { virtuals: true });
RoleSchema.set('toObject', { virtuals: true });