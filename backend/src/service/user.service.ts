import { CreateUserDto } from '@/dto/create-user.dto';
import { UpdateUserDto } from '@/dto/update-user.dto';
import { User } from '@/model/user.model';
import { UserRepository } from '@/repository/user.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[] | []>;
  findOne(id: string): Promise<User | undefined>;
  update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ affected: number }>;
  remove(id: string): Promise<{ affected: number }>;
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
  async findOne(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async update(
    id: string,
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
  async remove(id: string): Promise<{ affected: number }> {
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
