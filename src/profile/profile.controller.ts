import {
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/auth.guard';
import { ProfileDecorator } from '../helpers/decorators';
import { IProfile } from '../auth/interfaces';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppException } from '../helpers';
import { GetObjectOutput } from '@aws-sdk/client-s3';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  logger = new Logger(ProfileController.name);

  constructor(private profileService: ProfileService) {}

  @ApiBearerAuth('token')
  @Get()
  @UseGuards(AuthGuard)
  getProfile(@ProfileDecorator() profile: IProfile) {
    return this.profileService.getProfile(profile.uuid);
  }

  @ApiBearerAuth('token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile image (with auth)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('image/upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImageProfile(
    @ProfileDecorator() profile: IProfile,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp|heic|heif)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'File is required');
    }
    console.log(file.mimetype)
    try {
      return this.profileService.uploadImageProfile(profile.uuid, file);
    } catch (e) {
      throw e;
    }
  }
  //
  // @Get('image/get/:key')
  // async getImageProfile(@Param('key') key: string, @Res() res: Response) {
  //   try {
  //     const result: GetObjectOutput = await this.profileService.getImage(key);
  //     if (!result) {
  //       throw new AppException(HttpStatus.NOT_FOUND, 'Image not found');
  //     }
  //     const originalName = result.Metadata?.originalName ?? 'image.png';
  //     const resHeaders = {
  //       'Content-Type': result.ContentType,
  //       'Content-Disposition': `inline; filename="${originalName}"`,
  //     };
  //     return { ok: true };
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
