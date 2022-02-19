import { Controller, Request, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInput, AuthPayload } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  async login(@Body() body: UserInput): Promise<AuthPayload> {
    return this.service.login(body);
  }

  @Post('signup')
  async signup(@Body() body: UserInput): Promise<AuthPayload> {
    return this.service.signup(body);
  }
}
