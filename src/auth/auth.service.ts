import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dtos';
import { AccountService } from '../account/account.service';
import { CreateAccountDto, FilterAccountDto } from '../account/dto';
import { AppException } from '../shared/utils';
import { BcryptService } from '../shared/services';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private accountService: AccountService,
  ) {}

  async signUp(input: SignUpDto) {
    try {
      const existingAccount = await this.accountService.findOne({ username: input.username } as FilterAccountDto);
      if (existingAccount) {
        throw new AppException(HttpStatus.CONFLICT, 'Account already exists');
      }

      const passwordHash = await this.bcryptService.hash(input.password);
      const createAccountDto: CreateAccountDto = {
        username: input.username,
        email: input.email,
        passwordHash: passwordHash,
        name: input.name,
      };
      return await this.accountService.create(createAccountDto);
    } catch (e) {
      throw e;
    }
  }

  async signIn(input: SignInDto) {
    try {
      const account = await this.accountService.findOne({ username: input.username } as FilterAccountDto);
      if (!account) {
        throw new AppException(HttpStatus.NOT_FOUND, 'Account not found');
      }
      const isPasswordValid = await this.bcryptService.compare(input.password, account.passwordHash);
      if (!isPasswordValid) {
        throw new AppException(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
      }

      const accountDetails = await this.accountService.getAccountWithDetails(account.accountId);
      if (!accountDetails) {
        throw new AppException(HttpStatus.NOT_FOUND, 'Account not found');
      }

      return {
        access_token: this.jwtService.sign(accountDetails),
        ...accountDetails,
      };
    } catch (e) {
      this.logger.error(e);
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while signing in');
    }
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
