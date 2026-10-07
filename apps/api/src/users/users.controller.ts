import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getMe(@Headers('authorization') authHeader?: string) {
    const user = this.usersService.getUserFromToken(authHeader);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Get('policies')
  getPolicies(@Headers('authorization') authHeader?: string) {
    const user = this.usersService.getUserFromToken(authHeader);
    return this.usersService.getPolicies(user);
  }

  @Put('policies')
  updatePolicies(
    @Headers('authorization') authHeader: string,
    @Body('positions') positions: Record<string, 'AGREE' | 'DISAGREE' | 'NEUTRAL'>,
  ) {
    const user = this.usersService.getUserFromToken(authHeader);
    return this.usersService.updatePolicies(user, positions || {});
  }

  @Get('following')
  async getFollowing(@Headers('authorization') authHeader?: string) {
    const user = this.usersService.getUserFromToken(authHeader);
    return this.usersService.getFollowing(user);
  }

  @Post('following')
  @HttpCode(204)
  follow(
    @Headers('authorization') authHeader: string,
    @Body('politicianId') politicianId: string,
  ) {
    const user = this.usersService.getUserFromToken(authHeader);
    this.usersService.follow(user, politicianId);
  }

  @Delete('following/:politicianId')
  @HttpCode(204)
  unfollow(
    @Headers('authorization') authHeader: string,
    @Param('politicianId') politicianId: string,
  ) {
    const user = this.usersService.getUserFromToken(authHeader);
    this.usersService.unfollow(user, politicianId);
  }
}
