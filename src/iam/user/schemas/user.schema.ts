import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SortOrder } from 'mongoose';
import { randomBytes, randomUUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { IUser, UserType } from '../interfaces/user.interface';
import { compare } from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The uuid of user',
  })
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  uuid: string;

  @ApiProperty({
    example: 'admin',
    description: 'The username of user',
  })
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @ApiProperty({
    example: 'email@emai.com',
    description: 'The email of the user',
  })
  @Prop()
  email: string;

  @ApiProperty({
    example: '123456789',
    description: 'The telephone number of the user',
  })
  @Prop()
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

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @Prop()
  lastName: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The roles of the user',
  })
  @Prop()
  lastLoginAt: Date;

  @ApiProperty({
    example: 'superAdmin',
    description: 'The type of user',
    enum: UserType,
  })
  @Prop()
  userType: UserType;

  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The uuid of the organization',
  })
  @Prop()
  organizationUuid?: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date when the user registered',
  })
  @Prop()
  registeredAt?: Date;

  @ApiProperty({
    example: 'true',
    description: 'The activation status of the user',
  })
  @Prop()
  isActivated: boolean;

  @ApiProperty({
    example: 'true',
    description: 'The verification status of the user',
  })
  @Prop()
  isVerified: boolean;

  @ApiProperty({
    example: '123456789',
    description: 'The refresh token of the user',
  })
  @Prop({
    default: () => {
      return randomBytes(32).toString('hex');
    },
  })
  refreshToken?: string;

  @ApiProperty({
    example: '123456789',
    description: 'The profile image of the user',
  })
  @Prop()
  imageKey: string;

  @ApiProperty({
    example: '123456789',
    description: 'The profile image of the user',
  })
  @Prop()
  imageUrl: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date when the user was created',
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date when the user was updated',
  })
  @Prop()
  updatedAt: Date;

  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The uuid of the user who created this user',
  })
  @Prop()
  createdByUuid: string;

  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The uuid of the user who updated this user',
  })
  @Prop()
  updatedByUuid: string;

  validatePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSortOrderKey = ['createdAt', 'updatedAt'];

export type UserSortOrder = Record<string, SortOrder>;
