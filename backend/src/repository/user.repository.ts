import { CreateUserDto } from '@/dto/create-user.dto';
import { UpdateUserDto } from '@/dto/update-user.dto';
import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { User } from '../entities/user.entity';
export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
  findAll(): Promise<User[] | []>;
  findOne(id: number): Promise<User | undefined>;
  update(id: number, user: UpdateUserDto): Promise<{ affected: number }>;
  remove(id: number): Promise<{ affected: number }>;
}
@Injectable()
export class UserRepository implements OnModuleInit, IUserRepository {
  private users: User[] = [];
  constructor() {}
  onModuleInit() {
    const jsonDB = process.env.JSON_DB;
    if (jsonDB && Boolean(jsonDB)) {
      console.log('save on json file');
    }
  }
  create(user: CreateUserDto): Promise<User> {
    const hasUserWithEmail = this.users.some(
      (userExisting) =>
        userExisting.email === user.email || userExisting.cpf === user.cpf,
    );
    if (hasUserWithEmail) {
      throw new ConflictException('User already exists');
    }
    this.users.push({
      id: this.users.length + 1,
      ...user,
    } as User);
    return Promise.resolve(this.users[this.users.length - 1]);
  }
  findAll(): Promise<User[] | []> {
    return Promise.resolve(this.users);
  }
  findOne(id: number): Promise<User | undefined> {
    return Promise.resolve<User | undefined>(
      this.users.find((user) => user.id === id),
    );
  }
  update(id: number, user: UpdateUserDto): Promise<{ affected: number }> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return Promise.resolve<{ affected: number }>({ affected: 0 });
    }
    this.users[userIndex] = { ...this.users[userIndex], ...user } as User;
    return Promise.resolve<{ affected: number }>({ affected: 1 });
  }
  remove(id: number): Promise<{ affected: number }> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return Promise.resolve<{ affected: number }>({ affected: 0 });
    }
    this.users.splice(userIndex, 1);
    return Promise.resolve<{ affected: number }>({ affected: 1 });
  }
}
