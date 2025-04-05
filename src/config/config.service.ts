import { Injectable } from '@nestjs/common';
import { ConfigService as NestJSConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private config: NestJSConfigService) {}

  get port(): number {
    const port = this.config.get<number>('PORT');
    if (!port) {
      throw new Error('PORT is not defined in the environment variables');
    }
    return port;
  }

  get mongodbUrl(): string {
    const mongodbUrl = this.config.get<string>('MONGODB_URL');
    if (!mongodbUrl) {
      throw new Error(
        'MONGODB_URL is not defined in the environment variables',
      );
    }
    return mongodbUrl;
  }

  get privateKey(): string {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    if (!privateKey) {
      throw new Error(
        'PRIVATE KEY is not defined in the environment variables',
      );
    }
    return privateKey;
  }

  get publicKey(): string {
    const publicKey = this.config.get<string>('PUBLIC_KEY');
    if (!publicKey) {
      throw new Error('PUBLIC_KEY is not defined in the environment variables');
    }
    return publicKey;
  }

  get awsRegion(): string {
    const awsRegion = this.config.get<string>('AWS_REGION');
    if (!awsRegion) {
      throw new Error('AWS_REGION is not defined in the environment variables');
    }
    return awsRegion;
  }

  get awsAccessKey(): string {
    const awsAccessKey = this.config.get<string>('AWS_ACCESS_KEY');
    if (!awsAccessKey) {
      throw new Error(
        'AWS_ACCESS_KEY is not defined in the environment variables',
      );
    }
    return awsAccessKey;
  }

  get awsSecretAccessKey(): string {
    const awsSecretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    if (!awsSecretAccessKey) {
      throw new Error(
        'AWS_SECRET_ACCESS_KEY is not defined in the environment variables',
      );
    }
    return awsSecretAccessKey;
  }

  get awsBucketName(): string {
    const awsBucketName = this.config.get<string>('AWS_BUCKET_NAME');
    if (!awsBucketName) {
      throw new Error(
        'BUCKET_NAME is not defined in the environment variables',
      );
    }
    return awsBucketName;
  }
}
