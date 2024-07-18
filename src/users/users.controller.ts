import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { handleError } from 'src/common/responses/responses.helper';
import { NotFoundExceptionFilter } from 'src/common/filters/not-found.exception';

@Controller('api/users')
@UseFilters(NotFoundExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    try {
      const user = await this.usersService.findOne(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found.`);
      }
      return user;
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Partial<User>[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
