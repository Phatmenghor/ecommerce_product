/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  // async checkEmail(email: string): Promise<boolean> {
  //   const user = await this.prisma.user.findUnique({ where: { email } });
  //   return !!user;
  // }

  // async updatePassword(
  //   email: string,
  //   newPassword: string,
  // ): Promise<{ accessToken: string; userInfo: Partial<User> }> {
  //   const user = await this.prisma.user.findUnique({ where: { email } });

  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }

  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(newPassword, salt); // Hash the new password with salt

  //   // Update user's password in the database
  //   await this.prisma.user.update({
  //     where: { id: user.id },
  //     data: {
  //       password: hashedPassword,
  //     },
  //   });

  //   const accessToken = this.jwtService.sign({
  //     id: user.id,
  //     email: user.email,
  //   });

  //   return { accessToken, userInfo: user };
  // }
}
