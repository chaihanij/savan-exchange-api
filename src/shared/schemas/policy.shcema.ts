import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PolicyInterface, PolicyStatementEffectEnum, PolicyStatementInterface } from '../interfaces';
import { randomUUID } from 'crypto';

@Schema({ _id: false })
export class PolicyStatement implements PolicyStatementInterface {
  @ApiProperty({ example: 'allow', enum: PolicyStatementEffectEnum })
  @Prop({ enum: PolicyStatementEffectEnum, required: true })
  effect: PolicyStatementEffectEnum;

  @ApiProperty({ example: ['account:create', 'account:update'] })
  @Prop({ type: [String], required: true })
  action: string[];

  @ApiProperty({ example: ['account:*'] })
  @Prop({ type: [String], required: true })
  resource: string[];

  @ApiPropertyOptional({
    example: {
      stringEquals: {
        'account:tenantId': 'tenant-001',
      },
      stringLike: {
        'account:username': 'John*',
      },
    },
  })
  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: null,
  })
  condition: {
    stringEquals?: Record<string, string>;
    stringLike?: Record<string, string>;
    stringEqualsIfExists?: Record<string, string>;
    stringLikeIfExists?: Record<string, string>;
  };
}

export type PolicyDocument = HydratedDocument<Policy>;

@Schema({ timestamps: true, collection: 'policies' })
export class Policy implements PolicyInterface {
  @ApiProperty({ example: 'policy-001', description: 'Unique policy ID' })
  @Prop({ unique: true, default: () => randomUUID() })
  policyId: string;

  @ApiProperty({ example: 'tenant-001', description: 'Tenant ID' })
  @Prop({ default: null })
  tenantId: string;

  @ApiProperty({ example: 'ManageUsers', description: 'Policy name' })
  @Prop({ required: true })
  name: string;

  @ApiPropertyOptional({ example: 'Grants permission to manage user accounts', description: 'Policy description' })
  @Prop({ default: null })
  description: string;

  @ApiProperty({ example: true, description: 'Is this a system-wide policy?' })
  @Prop({ default: false })
  isSystemRole: boolean;

  @ApiProperty({
    description: 'Array of policy statements',
  })
  @Prop({
    type: [PolicyStatement],
    required: true,
  })
  statements: PolicyStatement[];

  @ApiProperty({ example: false })
  @Prop({ default: false, description: 'Soft delete flag' })
  isDeleted: boolean;

  @ApiProperty({ example: '2025-04-10T00:00:00.000Z', description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z', description: 'Last updated date' })
  updatedAt: Date;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
