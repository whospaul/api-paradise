import { Controller, Post, Body, Get, Headers, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('validateToken')
  validateToken(@Headers('Authorization') token: string) {
    return this.authService.validateToken(token);
  }

  @Delete('logout')
  logout(@Headers('Authorization') token: string) {
    return this.authService.logout(token);
  }
}
