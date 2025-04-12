import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../iam/user/user.service';
import * as sharp from 'sharp';
import { randomUUID } from 'crypto';
import { AwsService } from '../aws/aws.service';
import { AppException } from '../helpers';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly awsService: AwsService,
  ) {}

  async getProfile(uuid: string) {
    const profile = await this.userService.findOne({ uuid });
    if (!profile) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Profile not found');
    }
    if (profile.imageKey) {
      profile.imageUrl = await this.awsService.getSignedUrl(profile.imageKey);
    }
    return profile;
  }

  async uploadImageProfile(uuid: string, file: Express.Multer.File) {
    const originalName = file.originalname;
    const buffer = await this.resizeImageOriginal(file);
    const key = `profiles/original/${randomUUID()}`;
    try {
      const result = await this.awsService.uploadObject(
        buffer,
        key,
        'image/jpeg',
        {
          originalName,
        },
      );
      return this.userService.update(
        { uuid },
        { imageKey: result.key, imageUrl: result.url },
      );
    } catch (e) {
      throw e;
    }
  }

  private async resizeImageOriginal(file: Express.Multer.File) {
    return await sharp(file.buffer)
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  async getImage(key: string) {
    return await this.awsService.getObject(key);
  }
}
