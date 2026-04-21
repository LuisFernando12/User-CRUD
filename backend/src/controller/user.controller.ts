import { CreateUserDTO } from '@/dto/create-user.dto';
import { UpdateUserDTO } from '@/dto/update-user.dto';
import { User } from '@/model/user.model';
import { UserService } from '@/service/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginatedDTO, PaginatedResponseDTO } from '../dto/paginated.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return await this.userService.create(createUserDto);
  }
  @Get()
  async findAll(
    @Query() paginationQuery?: PaginatedDTO,
  ): Promise<PaginatedResponseDTO<User> | []> {
    return await this.userService.findAll({ ...paginationQuery });
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | undefined> {
    return await this.userService.findOne(id);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<{ affected: number }> {
    return await this.userService.update(id, updateUserDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ affected: number }> {
    return await this.userService.remove(id);
  }
}
