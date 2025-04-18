import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AccountDecorator } from '../shared/decorators/account.decorator';
import { AccountWithRolesAndPoliciesDto } from '../account/dto';

@Controller()
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'SignUp' })
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'SignIn' })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Get account details' })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @Get('account')
  @HttpCode(HttpStatus.OK)
  async getAccountDetails(@AccountDecorator() account: AccountWithRolesAndPoliciesDto) {
    this.logger.log('Account details retrieved successfully');
    return account;
  }
}
