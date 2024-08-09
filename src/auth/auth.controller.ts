/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
  ): Promise<{ accessToken: string; userInfo: Partial<User> }> {
    try {
      const { password, ...userInfo } = req.user;
      const accessToken = await this.authService.login(req.user);
      return {
        accessToken,
        userInfo,
      };
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; userInfo: Partial<User> }> {
    const userInfo = await this.authService.register(createUserDto);
    const accessToken = await this.authService.login(userInfo);
    const { password, ...userWithoutPassword } = userInfo;
    return { accessToken, userInfo: userWithoutPassword };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return user;
  }

  @Post('forgot-password')
  async checkEmail(@Body('email') email: string): Promise<{ exists: boolean }> {
    const exists = await this.authService.checkEmail(email);
    return { exists };
  }

  @Put('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ accessToken: string; userInfo: any }> {
    const result = await this.authService.updatePassword(email, newPassword);
    return result;
  }
}
