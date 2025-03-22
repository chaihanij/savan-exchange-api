import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HashingService } from '../hashing/hashing.service';
import { BcryptService } from '../hashing/bcrypt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
