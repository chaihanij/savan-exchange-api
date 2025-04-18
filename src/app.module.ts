import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { AccountModule } from './account/account.module';
import { PolicyModule } from './policy/policy.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TerminusModule,
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req: (req: any) => ({
            method: req.method,
            url: req.url,
          }),
          res: () => {},
        },
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const uri = config.mongodbUrl;
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    TenantModule,
    AccountModule,
    PolicyModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
