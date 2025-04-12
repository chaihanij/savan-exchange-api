import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from './schemas/image.schema';
import { Model, RootFilterQuery } from 'mongoose';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
  ) {}

  async createImage(image: any): Promise<Image> {
    const newImage = new this.imageModel(image);
    return await newImage.save();
  }

  async find(filter: RootFilterQuery<any>): Promise<Image[]> {
    return await this.imageModel.find(filter).exec();
  }

  async findOne(filter: RootFilterQuery<any>): Promise<Image | null> {
    return await this.imageModel.findOne(filter).exec();
  }
}
