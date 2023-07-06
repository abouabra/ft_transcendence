import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserInfo(@Query('userId') userId: string) {
    const userInfo = await this.userService.fetchUserInfo(userId);
    console.log(userInfo);
    return userInfo;
  }
}
