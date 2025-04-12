import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [UserService, HashingService],
})
export class UserModule {}
