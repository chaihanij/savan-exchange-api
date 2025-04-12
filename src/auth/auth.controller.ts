import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../iam/user/schemas/user.schema';

@Controller()
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'SignUp' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }
  
  @ApiOperation({ summary: 'SignIn' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
  
  
}
