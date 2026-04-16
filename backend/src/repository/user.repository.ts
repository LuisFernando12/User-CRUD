import { CreateUserDTO } from '@/dto/create-user.dto';
import { UpdateUserDTO } from '@/dto/update-user.dto';
import { User } from '@/model/user.model';
import {
  ConflictException,
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
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error creating user');
    }
  }
  async findAll(): Promise<User[] | []> {
    return await this.userModel.find();
  }
  async findOne(id: string): Promise<User | undefined> {
    return await this.userModel.findOne({ _id: id });
  }
  async update(id: string, user: UpdateUserDTO): Promise<{ affected: number }> {
    try {
      const userUpdated = await this.userModel.updateOne({ _id: id }, user);
      if (userUpdated.acknowledged) {
        return { affected: 1 };
      } else {
        return { affected: 0 };
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error updating user');
    }
  }
  async remove(id: string): Promise<{ affected: number }> {
    const userDeleted = await this.userModel.deleteOne({
      _id: id,
    });
    if (userDeleted.acknowledged) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }
  async userExists(cpf: string, email: string): Promise<boolean> {
    return !!(await this.userModel.exists({
      $or: [{ cpf: cpf }, { email: email }],
    }));
  }
}
