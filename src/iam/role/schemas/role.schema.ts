import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SortOrder } from 'mongoose';
import { Action } from '../enums/action.enum';
import { Resource } from '../enums/resource.enum';
import { randomUUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { Org } from '../../org/schemas/org.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
class Permission {
  @Prop({ required: true, enum: Resource })
  @ApiProperty({
    description: 'The resource of role',
    enum: ['settings', 'orgs', 'roles', 'users'],
    example: 'settings',
  })
  resource: Resource;

  @Prop({ type: [{ type: String, enum: Action }] })
  @ApiProperty({
    description: 'The actions of role',
    enum: ['read', 'create', 'update', 'delete'],
    isArray: true,
    example: ['read', 'create'],
  })
  actions: Action[];
}

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toObject: { virtuals: true },
})
export class Role {
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The uuid of role',
  })
  uuid: string;

  @Prop({ required: true })
  @ApiProperty({
    example: 'admin',
    description: 'The name of role',
  })
  name: string;

  @Prop({ required: true, type: [Permission] })
  @ApiProperty({
    description: 'The permissions of role',
    type: Permission,
    isArray: true,
  })
  permissions: Permission[];

  @Prop()
  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The orgUuid of role',
  })
  orgUuid: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The created date of org',
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'Role created by user',
  })
  @Prop()
  createdByUuid: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The updated date of org',
  })
  @Prop()
  updatedAt: Date;

  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'Role updated by user',
  })
  @Prop()
  updatedByUuid: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.virtual('org', {
  ref: Org.name,
  localField: 'orgUuid',
  foreignField: 'uuid',
  justOne: true,
});

export type RoleProjection = {
  _id: number;
  uuid: number;
  name: number;
  permissions: number;
  orgUuid: number;
  createdAt: number;
  updatedAt: number;
};

export const RoleSortOrderKey = ['name', 'orgUuid', 'createdAt', 'updatedAt'];
export type RoleSortOrder = Record<string, SortOrder>;
