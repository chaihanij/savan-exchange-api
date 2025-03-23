import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UnauthorizedException } from './auth.exception';
import { INVALID_PASSWORD } from './auth.constant';
import { USER_ALREADY_EXISTS, USER_NOT_FOUND } from '../user/user.constant';
import { AppException } from '../../helpers';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async signUp(input: SignUpDto) {
    try {
      const user = await this.userService.findOne({
        username: input.username,
      });
      if (user) {
        const e = new AppException(HttpStatus.CONFLICT, USER_ALREADY_EXISTS);
        return Promise.reject(e);
      }
      const hashedPassword = await this.hashingService.hash(input.password);
      return await this.userService.create({
        username: input.username,
        password: hashedPassword,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async signIn(input: SignInDto) {
    try {
      const user = await this.userService.update(
        {
          username: input.username,
        },
        { lastLoginAt: new Date() },
      );
      if (!user) {
        const e = new AppException(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
        return Promise.reject(e);
      }
      const isPasswordMatch = await this.hashingService.compare(
        input.password,
        user.password,
      );
      if (!isPasswordMatch) {
        const e = UnauthorizedException(INVALID_PASSWORD);
        return Promise.reject(e);
      }
      const jwt = this.jwtService.sign({ uuid: user.uuid });
      return { jwt };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
