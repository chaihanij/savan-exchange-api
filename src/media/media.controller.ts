import { Body, Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppException } from '../shared/utils';
import { DetectedMediaTypes } from '../shared/utils/detect-media-type';
import { MediaType } from '../shared/interfaces';
import { UploadMediaDto } from './dto';
import { Response } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image file to S3' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        visibility: { type: 'string', enum: ['public', 'private'], default: 'public' },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadMediaDto) {
    if (!file) throw new AppException(HttpStatus.BAD_REQUEST, 'File is required');
    const mediaType = DetectedMediaTypes(file.mimetype);
    if (mediaType === MediaType.OTHER) throw new AppException(HttpStatus.BAD_REQUEST, 'Invalid file type');
    try {
      const { key, url } = await this.mediaService.uploadFileToS3(file, dto.visibility);
      return await this.mediaService.create({
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        key,
        url,
        visibility: dto.visibility,
      });
    } catch (e) {
      throw e;
    }
  }

  @Get('get/:mediaId')
  @ApiOperation({ summary: 'Get a media file by ID' })
  async getMedia(@Param('mediaId') mediaId: string) {
    try {
      return this.mediaService.findOne({ mediaId });
    } catch (e) {
      throw e;
    }
  }

  @Get('public/:mediaId')
  @ApiOperation({ summary: 'Get a public media file by ID' })
  async getPublicMedia(@Param('mediaId') mediaId: string) {
    try {
      const media = await this.mediaService.findOne({ mediaId });
      if (!media) throw new AppException(HttpStatus.NOT_FOUND, 'Media not found');
      return await this.mediaService.getPrivateFileUrl(media.key);
    } catch (e) {
      throw e;
    }
  }

  @Get('download/:mediaId')
  @ApiOperation({ summary: 'Download a media file by ID' })
  async download(@Param('mediaId') mediaId: string, @Res() res: Response) {
    try {
      const media = await this.mediaService.findOne({ mediaId });
      if (!media) throw new AppException(HttpStatus.NOT_FOUND, 'Media not found');
      const stream = await this.mediaService.getS3ObjectStream(media.key);
      const fileName = media.fileName;
      res.setHeader('Content-Type', media.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      stream.pipe(res);
    } catch (e) {
      throw e;
    }
  }
}
