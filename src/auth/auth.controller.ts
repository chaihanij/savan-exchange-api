import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponseDto, SignUpDto } from './dtos';
import { AccountResponseDto, AccountWithRolesAndPoliciesDto } from '../account/dto';
import { AccessTokenGuard, JwtTokenGuard, RefreshTokenGuard } from './guards';
import { AccountDecorator } from '../shared/decorators';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  private setCookies(res: Response, accessToken: string, refreshToken: string): void {
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: true,
    };

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });
  }

  @ApiOperation({ summary: 'SignUp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signup successfully',
    type: AccountResponseDto,
  })
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'SignIn' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SignIn successful',
    type: SignInResponseDto,
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    const { accessToken, refreshToken, account } = await this.authService.signIn(signInDto);
    return Object.assign({ accessToken, refreshToken }, account);
  }

  @ApiOperation({ summary: 'Get account details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account details retrieved successfully',
    type: AccountWithRolesAndPoliciesDto,
  })
  @ApiBearerAuth('token')
  @ApiCookieAuth('accessToken')
  @UseGuards(JwtTokenGuard, AccessTokenGuard)
  @Get('account')
  @HttpCode(HttpStatus.OK)
  async getAccountDetails(@AccountDecorator() account: AccountWithRolesAndPoliciesDto) {
    return account;
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: AccountWithRolesAndPoliciesDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: SignInDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, account } = await this.authService.login(input);
    this.setCookies(res, accessToken, refreshToken);
    return account;
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: AccountWithRolesAndPoliciesDto,
  })
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @AccountDecorator() account: AccountWithRolesAndPoliciesDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(account);
    this.setCookies(res, accessToken, refreshToken);
    return account;
  }
}