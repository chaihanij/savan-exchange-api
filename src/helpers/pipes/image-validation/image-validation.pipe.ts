import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { AppException } from '../../app.exception';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'File is required');
    }
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Invalid file type. Allowed types: jpeg, png, webp, heic, heif',
      );
    }
  }
}
