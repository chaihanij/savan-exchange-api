import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountInterface, AccountStatus, AccountTypeEnum, ProviderEnum } from '../interfaces';
import { randomUUID } from 'crypto';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true, collection: 'accounts' })
export class Account implements AccountInterface {
  @ApiProperty({ example: 'a-001', description: 'Unique account ID' })
  @Prop({
    unique: true,
    default: () => {
      return randomUUID();
    },
  })
  accountId: string;

  @ApiPropertyOptional({ example: 'tenant-123', description: 'Tenant ID' })
  @Prop({ default: null })
  tenantId: string;

  @ApiProperty({ example: AccountTypeEnum.Customer, enum: AccountTypeEnum, description: 'Type of account' })
  @Prop({ type: String, enum: AccountTypeEnum, default: AccountTypeEnum.Customer })
  accountType: AccountTypeEnum;

  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @Prop()
  username: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
  @Prop()
  email: string;

  @ApiProperty({ example: 'hashed-password', description: 'Password hash' })
  @Prop({ required: true })
  passwordHash: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  @Prop({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ example: false, description: 'Two-factor authentication enabled' })
  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @ApiProperty({ example: AccountStatus.Active, enum: AccountStatus, description: 'Account status' })
  @Prop({ type: String, enum: AccountStatus, default: AccountStatus.Pending })
  status: AccountStatus;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Soft delete date' })
  @Prop({ default: null })
  deletedAt: Date;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @Prop({ default: null })
  name: string;

  @ApiPropertyOptional({ example: '+11234567890', description: 'Phone number' })
  @Prop({ default: null })
  phone: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'Avatar URL' })
  @Prop({ default: null })
  avatarUrl: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Address line 1' })
  @Prop({ default: null })
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Apt 456', description: 'Address line 2' })
  @Prop({ default: null })
  addressLine2: string;

  @ApiProperty({ example: ProviderEnum.Local, enum: ProviderEnum, description: 'Authentication provider' })
  @Prop({ type: String, enum: ProviderEnum, default: ProviderEnum.Local })
  provider: ProviderEnum;

  @ApiPropertyOptional({ example: 'google-abc123', description: 'Provider account ID' })
  @Prop({ default: null })
  providerId: string;

  @ApiPropertyOptional({ example: '2025-04-01T08:00:00.000Z', description: 'Last login datetime' })
  @Prop({ default: null })
  lastLoginAt: Date;

  @ApiPropertyOptional({ example: ['role-1', 'role-2'], description: 'List of role IDs' })
  @Prop({ type: [String], default: [] })
  roleIds: string[];

  @ApiPropertyOptional({ example: ['policy-1', 'policy-2'], description: 'List of policy IDs' })
  @Prop({ type: [String], default: [] })
  policyIds: string[];

  @ApiProperty({ example: false, description: 'Soft delete status' })
  @Prop({ default: false })
  isDeleted: boolean;
  
  @ApiProperty({ example: '2025-04-10T00:00:00.000Z', description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z', description: 'Last updated date' })
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
