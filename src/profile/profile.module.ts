import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { UserModule } from '../iam/user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ImageModule } from '../image/image.module';
import { AwsModule } from '../aws/aws.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule, UserModule, ImageModule, AwsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
