import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SortOrder } from 'mongoose';
import { randomUUID } from 'crypto';
import { AccountType } from '../enums/account-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The uuid of user',
  })
  uuid: string;

  @Prop({
    required: true,
    unique: true,
  })
  @ApiProperty({
    example: 'admin',
    description: 'The username of user',
  })
  username: string;

  @Prop()
  @ApiProperty({
    example: 'email@emai.com',
    description: 'The email of the user',
  })
  email: string;

  @Prop()
  @ApiProperty({
    example: '123456789',
    description: 'The telephone number of the user',
  })
  tel: string;

  @Prop()
  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  password: string;

  @Prop()
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  firstName: string;

  @Prop()
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  lastName: string;

  @Prop()
  @ApiProperty({
    example: ['8773c280-f1c6-441c-bab9-e1aa76a55cf1'],
    description: 'The roleUuids of the user',
  })
  roleUuids: string[];

  @Prop()
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The roles of the user',
  })
  lastLoginAt: Date;

  @Prop({
    default: () => {
      return AccountType.USER;
    },
    type: [{ type: Number, enum: AccountType }],
  })
  @ApiProperty({
    example: AccountType.USER,
    description: 'The account type of the user',
  })
  accountType: AccountType;

  @Prop()
  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The orgUuid of user',
  })
  orgUuid: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('roles', {
  ref: 'Role',
  localField: 'roleUuids',
  foreignField: 'uuid',
  justOne: false,
});

UserSchema.virtual('org', {
  ref: 'Org',
  localField: 'orgUuid',
  foreignField: 'uuid',
  justOne: true,
  options: { select: { uuid: 1, name: 1 } },
});

export type UserProjection = {
  _id?: number;
  uuid?: number;
  username?: number;
  email?: number;
  tel?: number;
  password?: number;
  firstName?: number;
  lastName?: number;
  roleUuids?: number;
  roles?: number;
  lastLoginAt?: number;
  accountType?: number;
  orgUuid?: number;
  createdAt?: number;
  updatedAt?: number;
};

export const UserSortOrderKey = ['createdAt', 'updatedAt'];
export type UserSortOrder = Record<string, SortOrder>;
