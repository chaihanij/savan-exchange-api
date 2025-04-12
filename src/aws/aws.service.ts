import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppException } from '../helpers';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  s3Client: S3Client;
  bucket: string;

  constructor(private config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.awsRegion,
      credentials: {
        accessKeyId: this.config.awsAccessKey,
        secretAccessKey: this.config.awsSecretAccessKey,
      },
    });
    this.bucket = this.config.awsBucketName;
  }

  async getSignedUrl(key: string) {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, cmd, { expiresIn: 3600 * 24 });
  }

  async getObject(key: string) {
    return await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async uploadObject(
    buffer: Buffer,
    key: string,
    contentType: string,
    metaData: Record<string, string> = {},
    isPublic: boolean = false,
  ) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: isPublic ? 'public-read' : 'private',
      Metadata: metaData,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.warn({ error }, 'Error uploading to S3');
      throw new AppException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error uploading file to S3',
      );
    }
    const result = await this.s3Client.send(command);
    if (result.$metadata.httpStatusCode !== 200) {
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, 'Upload failed');
    }
    return {
      key: key,
      url: `https://${this.bucket}.s3.${this.config.awsRegion}.amazonaws.com/${key}`,
    };
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.warn({ error }, 'Error deleting from S3');
      throw new AppException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error deleting file from S3',
      );
    }
  }
}
