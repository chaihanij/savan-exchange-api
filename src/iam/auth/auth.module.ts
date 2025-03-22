import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '../../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingService } from '../hashing/hashing.service';
import { BcryptService } from '../hashing/bcrypt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: config.privateKey,
          publicKey: config.publicKey,
          signOptions: {
            issuer: 'https://svan-ex.co/issuer',
            expiresIn: '24h',
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [],
})
export class AuthModule {}
