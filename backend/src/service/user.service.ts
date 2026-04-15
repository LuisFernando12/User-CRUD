import { CreateUserDto } from '@/dto/create-user.dto';
import { UpdateUserDto } from '@/dto/update-user.dto';
import { UserRepository } from '@/repository/user.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[] | []>;
  findOne(id: number): Promise<User | undefined>;
  update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ affected: number }>;
  remove(id: number): Promise<{ affected: number }>;
}
@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }
  async findAll(): Promise<User[] | []> {
    return await this.userRepository.findAll();
  }
  async findOne(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ affected: number }> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('At least one field is required to update');
    }
    return await this.userRepository.update(id, updateUserDto);
  }
  async remove(id: number): Promise<{ affected: number }> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    const userDeleted = await this.userRepository.remove(id);
    if (userDeleted.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return userDeleted;
  }
}
