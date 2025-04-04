import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsS3ServiceService {
  awsRegion: string;
  awsAccessKey: string;
  awsSecretAccessKey: string;
  bucketName: string;

  private s3: S3;

  constructor(private config: ConfigService) {
    this.awsRegion = this.config.awsRegion;
    this.awsAccessKey = this.config.awsAccessKey;
    this.awsSecretAccessKey = this.config.awsSecretAccessKey;
    this.bucketName = this.config.bucketName;
    this.s3 = new S3({
      region: this.awsRegion,
      credentials: {
        accessKeyId: this.awsAccessKey,
        secretAccessKey: this.awsSecretAccessKey,
      },
    });
  }

  async upload(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    const result = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read',
      })
      .promise();
    return result.Location;
  }
}
