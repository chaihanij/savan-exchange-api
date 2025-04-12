import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '../config';
import { AuthGuard } from './auth.guard';
import { UserService } from '../iam/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../iam/user/schemas/user.schema';
import { HashingService } from '../iam/user/hashing/hashing.service';
import { BcryptService } from '../iam/user/hashing/bcrypt.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: config.privateKey,
          publicKey: config.publicKey,
          signOptions: {
            issuer: 'https://svan-ex.co/issuer',
            expiresIn: '30d',
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    AwsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthGuard,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
