import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '../config';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../shared/schemas/account.schema';
import { AccountService } from '../account/account.service';
import { BcryptService } from '../shared/services';
import { AccessTokenGuard, JwtTokenGuard, PolicyGuard, RefreshTokenGuard } from './guards';

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
            expiresIn: '1d',
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    BcryptService,
    JwtTokenGuard,
    AccessTokenGuard,
    RefreshTokenGuard,
    PolicyGuard,
  ],
  exports: [AuthService, JwtTokenGuard, AccessTokenGuard, RefreshTokenGuard, PolicyGuard],
})
export class AuthModule {}
