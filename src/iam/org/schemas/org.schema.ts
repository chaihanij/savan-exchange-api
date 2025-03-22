import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SortOrder } from 'mongoose';
import { randomUUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/schemas/user.schema';

export type OrgDocument = HydratedDocument<Org>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toObject: { virtuals: true },
})
export class Org {
  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'The uuid of org',
  })
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  uuid: string;

  @ApiProperty({ example: 'name', description: 'The name of org' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'address', description: 'The address of org' })
  @Prop()
  address: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The created date of org',
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    example: '8773c280-f1c6-441c-bab9-e1aa76a55cf1',
    description: 'Org created by user',
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
    description: 'Org updated by user',
  })
  @Prop()
  updatedByUuid: string;
}

export const OrgSchema = SchemaFactory.createForClass(Org);
OrgSchema.virtual('createdBy', {
  ref: User.name,
  localField: 'createdByUuid',
  foreignField: 'uuid',
  justOne: true,
  options: { select: { username: 1, firstName: 1, lastName: 1 } },
});
OrgSchema.virtual('updatedBy', {
  ref: User.name,
  localField: 'updatedByUuid',
  foreignField: 'uuid',
  justOne: true,
  options: { select: { username: 1, firstName: 1, lastName: 1 } },
});

export type OrgProjection = {
  _id: number;
  uuid: number;
  name: number;
  address: number;
  createdAt: number;
  updatedAt: number;
};

export const OrgSortOrderKey = ['name', 'createdAt', 'updatedAt'];
export type OrgSortOrder = Record<string, SortOrder>;
