import { CreateUserDTO } from '@/dto/create-user.dto';
import { UpdateUserDTO } from '@/dto/update-user.dto';
import { User } from '@/model/user.model';
import { UserRepository } from '@/repository/user.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedDTO, PaginatedResponseDTO } from '../dto/paginated.dto';
export interface IUserService {
  create(createUserDto: CreateUserDTO): Promise<User>;
  findAll(pagination?: PaginatedDTO): Promise<PaginatedResponseDTO<User> | []>;
  findOne(id: string): Promise<User | undefined>;
  update(
    id: string,
    updateUserDto: UpdateUserDTO,
  ): Promise<{ affected: number }>;
  remove(id: string): Promise<{ affected: number }>;
}
@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDTO): Promise<User> {
    if (
      await this.userRepository.userExists(
        createUserDto.cpf,
        createUserDto.email,
      )
    ) {
      throw new ConflictException('Conflict data');
    }
    return await this.userRepository.create(createUserDto);
  }
  async findAll(
    pagination?: PaginatedDTO,
  ): Promise<PaginatedResponseDTO<User> | []> {
    return await this.userRepository.findAll({ ...pagination });
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
    updateUserDto: UpdateUserDTO,
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
