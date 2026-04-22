import { CreateUserDTO } from '@/dto/create-user.dto';
import { UpdateUserDTO } from '@/dto/update-user.dto';
import { User } from '@/model/user.model';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { PaginatedDTO, PaginatedResponseDTO } from '../dto/paginated.dto';
export interface IUserRepository {
  create(user: CreateUserDTO): Promise<User>;
  findAll({
    limit,
    page,
  }: PaginatedDTO): Promise<PaginatedResponseDTO<User> | []>;
  findOne(id: string): Promise<User | undefined>;
  update(id: string, user: UpdateUserDTO): Promise<{ affected: number }>;
  remove(id: string): Promise<{ affected: number }>;
  userExists(cpf: string, email: string): Promise<boolean>;
}
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(user: CreateUserDTO): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      return createdUser.save();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error creating user');
    }
  }
  async findAll({
    limit = 0,
    page = 0,
  }: PaginatedDTO): Promise<PaginatedResponseDTO<User> | []> {
    try {
      const skip = (page - 1) * limit;
      const [userDB, totalDocuments] = await Promise.all([
        this.userModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        this.userModel.countDocuments(),
      ]);
      const totalPages = Math.ceil(totalDocuments / limit);
      if (page > 1 && page > totalPages) {
        throw new BadRequestException('Page not found');
      }
      return {
        result: userDB,
        page: page || 1,
        limit: limit || totalDocuments,
        totalPages: !Number.isFinite(totalPages) ? 1 : totalPages,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error finding users');
    }
  }
  async findOne(id: string): Promise<User | undefined> {
    try {
      return await this.userModel.findOne({ _id: id });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Error.CastError && error.name === 'CastError') {
        throw new BadRequestException(
          'Error to finding user',
          `The id ${id} is invalid`,
        );
      }

      throw new InternalServerErrorException('Error to finding user');
    }
  }
  async update(id: string, user: UpdateUserDTO): Promise<{ affected: number }> {
    try {
      const userUpdated = await this.userModel.updateOne({ _id: id }, user);
      return { affected: userUpdated.modifiedCount > 0 ? 1 : 0 };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error updating user');
    }
  }
  async remove(id: string): Promise<{ affected: number }> {
    try {
      const userDeleted = await this.userModel.deleteOne({
        _id: id,
      });
      return { affected: userDeleted.deletedCount > 0 ? 1 : 0 };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error deleting user');
    }
  }
  async userExists(cpf: string, email: string): Promise<boolean> {
    return !!(await this.userModel.exists({
      $or: [{ cpf: cpf }, { email: email }],
    }));
  }
}
