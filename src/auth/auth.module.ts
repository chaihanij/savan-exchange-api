import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '../config';
import { AuthGuard } from './auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../shared/schemas/account.schema';
import { AccountService } from '../account/account.service';
import { BcryptService } from '../shared/services';
import { PoliciesGuard } from './policies.guard';

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
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountService, BcryptService, AuthGuard, PoliciesGuard],
  exports: [AuthService, AuthGuard, PoliciesGuard],
})
export class AuthModule {}
