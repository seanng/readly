import { Controller, Request, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInput } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req: UserInput) {
    return this.authService.login(req);
  }

  @Post('signup')
  async signup(@Body() req: UserInput) {
    try {
      return this.authService.signup(req);
    } catch (error) {
      console.log('error n controller: ', error);
      throw error;
    }
  }
}
