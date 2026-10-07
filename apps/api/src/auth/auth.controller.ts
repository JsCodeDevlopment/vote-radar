import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(name || 'Cidadão', email, password);
  }

  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.authenticate(email, password);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Headers('authorization') authHeader?: string) {
    this.usersService.logout(authHeader);
  }
}
