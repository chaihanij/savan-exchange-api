import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from './schemas/image.schema';
import { ImageService } from './image.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
