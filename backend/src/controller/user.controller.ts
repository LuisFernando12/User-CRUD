import { CreateUserDto } from '@/dto/create-user.dto';
import { UpdateUserDto } from '@/dto/update-user.dto';
import { UserService } from '@/service/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }
  @Get()
  async findAll(): Promise<User[] | []> {
    return await this.userService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User | undefined> {
    return await this.userService.findOne(id);
  }
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ affected: number }> {
    return await this.userService.update(id, updateUserDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ affected: number }> {
    return await this.userService.remove(id);
  }
}
