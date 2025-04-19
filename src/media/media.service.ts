import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from '../shared/schemas/media.schema';
import { FilterQuery, Model } from 'mongoose';
import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '../config';
import { VisibilityEnum } from '../shared/interfaces';
import { extname } from 'path';
import { DetectedMediaTypes } from '../shared/utils/detect-media-type';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppException } from '../shared/utils';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.awsBucketName;
    this.region = this.configService.awsRegion;
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.awsAccessKey,
        secretAccessKey: this.configService.awsSecretAccessKey,
      },
    });
  }

  async uploadFileToS3(
    file: Express.Multer.File,
    visibility: VisibilityEnum = VisibilityEnum.PUBLIC,
    ownerId?: string,
  ): Promise<{ key: string; url?: string }> {
    const key = this.generateS3Key(file, visibility);

    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      await this.s3Client.send(new PutObjectCommand(params));
      const url = visibility === VisibilityEnum.PUBLIC ? this.getPublicUrl(key) : undefined;
      return { key, url };
    } catch (err) {
      this.handleError('uploading file to S3', err);
    }
  }

  async getS3ObjectStream(key: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const result = await this.s3Client.send(command);
      return result.Body as Readable;
    } catch (err) {
      this.logger.error(`Error downloading file from S3: ${err.message}`);
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, 'Download failed');
    }
  }

  async getPrivateFileUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 86400 }); // 24hr
    } catch (err) {
      this.handleError('getting private file URL', err);
    }
  }

  async count(filter: FilterQuery<MediaDocument> = {}): Promise<number> {
    try {
      return Object.keys(filter).length === 0
        ? this.mediaModel.estimatedDocumentCount()
        : this.mediaModel.countDocuments(filter);
    } catch (err) {
      this.handleError('counting media', err);
    }
  }

  async find(filter: FilterQuery<MediaDocument>): Promise<MediaDocument[]> {
    try {
      return this.mediaModel.find(filter);
    } catch (err) {
      this.handleError('finding media', err);
    }
  }

  async create(data: Partial<MediaDocument>): Promise<MediaDocument> {
    try {
      return await new this.mediaModel(data).save();
    } catch (err) {
      this.handleError('creating media', err);
    }
  }

  async findOne(filter: FilterQuery<MediaDocument>): Promise<MediaDocument | null> {
    try {
      return this.mediaModel.findOne(filter);
    } catch (err) {
      this.handleError('finding one media', err);
    }
  }

  async delete(filter: FilterQuery<MediaDocument>): Promise<void> {
    try {
      const result = await this.mediaModel.findOneAndDelete(filter);
      if (!result) {
        throw new AppException(HttpStatus.NOT_FOUND, 'Media not found');
      }
    } catch (err) {
      this.handleError('deleting media', err);
    }
  }

  private generateS3Key(file: Express.Multer.File, visibility: VisibilityEnum): string {
    const ext = extname(file.originalname);
    const mediaType = DetectedMediaTypes(file.mimetype);
    return `${visibility}/${mediaType}/${randomUUID()}${ext}`;
  }

  private getPublicUrl(key: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private handleError(context: string, err: any): never {
    if (err instanceof AppException) {
      throw err;
    }
    const message = `Error ${context}: ${err.message}`;
    this.logger.error(message);
    throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
