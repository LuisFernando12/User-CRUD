import { CreateUserDto } from '@/dto/create-user.dto';
import { UpdateUserDto } from '@/dto/update-user.dto';
import { User } from '@/model/user.model';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
  findAll(): Promise<User[] | []>;
  findOne(id: string): Promise<User | undefined>;
  update(id: string, user: UpdateUserDto): Promise<{ affected: number }>;
  remove(id: string): Promise<{ affected: number }>;
}
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(user: CreateUserDto): Promise<User> {
    try {
      const userDB = await this.userModel.findOne({
        $or: [{ cpf: user.cpf }, { mail: user.email }],
      });
      if (userDB) {
        throw new ConflictException('User already exists');
      }
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
  async update(id: string, user: UpdateUserDto): Promise<{ affected: number }> {
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
}
