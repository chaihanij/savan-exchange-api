import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dtos';
import { AccountService } from '../account/account.service';
import { AccountWithRolesAndPoliciesDto, CreateAccountDto, FilterAccountDto } from '../account/dto';
import { AppException } from '../shared/utils';
import { BcryptService } from '../shared/services';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly accountService: AccountService,
  ) {}

  async signUp(input: SignUpDto) {
    const existingAccount = await this.accountService.findOne({ username: input.username } as FilterAccountDto);
    if (existingAccount) {
      throw new AppException(HttpStatus.CONFLICT, 'Account already exists');
    }

    const passwordHash = await this.bcryptService.hash(input.password);
    const createAccountDto: CreateAccountDto = {
      username: input.username,
      email: input.email,
      passwordHash,
      name: input.name,
    };

    return this.accountService.create(createAccountDto);
  }

  async signIn(input: SignInDto) {
    const account = await this.validateAccount(input.username, input.password);
    const accountDetails = await this.getAccountDetails(account.accountId);

    return this.generateAuthResponse(accountDetails);
  }

  async login(input: SignInDto) {
    const account = await this.validateAccount(input.username, input.password);
    const accountDetails = await this.getAccountDetails(account.accountId);

    return this.generateAuthResponse(accountDetails);
  }

  async refreshToken(input: RefreshTokenDto) {
    const account = await this.verify(input.refreshToken);
    if (!account) {
      throw new AppException(HttpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }
    return this.generateAuthResponse(account);
  }

  async verify(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const account = await this.getAccountDetails(payload.sub);

      if (!account) {
        throw new AppException(HttpStatus.FORBIDDEN, `Account with ID ${payload.sub} not found`);
      }

      return account;
    } catch (e) {
      this.handleTokenError(e);
    }
  }

  // Private helper methods
  private async validateAccount(username: string, password: string) {
    const account = await this.accountService.findOne({ username } as FilterAccountDto);
    if (!account) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Account not found');
    }

    const isPasswordValid = await this.bcryptService.compare(password, account.passwordHash);
    if (!isPasswordValid) {
      throw new AppException(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    return account;
  }

  private async getAccountDetails(accountId: string) {
    const accountDetails = await this.accountService.getAccountWithDetails(accountId);
    if (!accountDetails) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Account details not found');
    }

    return accountDetails;
  }

  private generateAuthResponse(account: AccountWithRolesAndPoliciesDto) {
    const payload = { sub: account.accountId, username: account.username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken, account };
  }

  private handleTokenError(error: any) {
    if (error instanceof TokenExpiredError) {
      throw new AppException(HttpStatus.UNAUTHORIZED, 'Token expired');
    } else if (error instanceof JsonWebTokenError) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Invalid token');
    } else if (error instanceof NotBeforeError) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Token not active');
    } else {
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, error?.message || 'Unknown token error');
    }
  }
}