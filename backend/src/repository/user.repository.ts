import { CreateUserDTO } from '@/dto/create-user.dto';
import { UpdateUserDTO } from '@/dto/update-user.dto';
import { User } from '@/model/user.model';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
export interface IUserRepository {
  create(user: CreateUserDTO): Promise<User>;
  findAll(): Promise<User[] | []>;
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
      throw new InternalServerErrorException(error, 'Error creating user');
    }
  }
  async findAll(): Promise<User[] | []> {
    return await this.userModel.find();
  }
  async findOne(id: string): Promise<User | undefined> {
    try {
      return await this.userModel.findOne({ _id: id });
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(
          'Error to finding user',
          `The id ${id} is invalid`,
        );
      }
      throw new InternalServerErrorException(error, 'Error to finding user');
    }
  }
  async update(id: string, user: UpdateUserDTO): Promise<{ affected: number }> {
    try {
      const userUpdated = await this.userModel.updateOne({ _id: id }, user);
      return { affected: userUpdated.modifiedCount > 0 ? 1 : 0 };
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error updating user');
    }
  }
  async remove(id: string): Promise<{ affected: number }> {
    const userDeleted = await this.userModel.deleteOne({
      _id: id,
    });
    return { affected: userDeleted.deletedCount > 0 ? 1 : 0 };
  }
  async userExists(cpf: string, email: string): Promise<boolean> {
    return !!(await this.userModel.exists({
      $or: [{ cpf: cpf }, { email: email }],
    }));
  }
}
