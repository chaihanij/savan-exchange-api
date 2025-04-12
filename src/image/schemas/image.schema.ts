import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: false,
  },
})
export class Image {
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  uuid: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({})
  contentType: string;

  @Prop({})
  originalKey: string;

  @Prop({})
  originalUrl: string;

  @Prop({})
  thumbnailKey: string;

  @Prop({})
  thumbnailUrl: string;

  @Prop({})
  compressedKey: string;

  @Prop({})
  compressedUrl: string;

  @Prop()
  createdAt: Date;

  @Prop()
  createdByUuid: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
