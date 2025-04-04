import { Module } from '@nestjs/common';
import { AwsS3ServiceService } from './aws-s3-service/aws-s3-service.service';
import { ConfigModule } from '../config';

@Module({
  imports: [ConfigModule],
  providers: [AwsS3ServiceService],
  exports: [AwsS3ServiceService],
})
export class AwsModule {}
