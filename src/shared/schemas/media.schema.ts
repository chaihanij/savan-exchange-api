import { MediaInterface, VisibilityEnum } from '../interfaces';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';

export type MediaDocument = HydratedDocument<Media>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: undefined,
  },
  collection: 'medias',
})
export class Media implements MediaInterface {
  @Prop({
    unique: true,
    default: () => {
      return randomUUID();
    },
  })
  mediaId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  key: string;

  @Prop({ default: null })
  url: string;

  @Prop({ type: String, enum: VisibilityEnum, default: VisibilityEnum.PUBLIC })
  visibility: VisibilityEnum;

  @Prop({ default: null })
  ownerId: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
