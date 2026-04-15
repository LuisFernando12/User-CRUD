import { UserController } from '@/controller/user.controller';
import { UserSchema } from '@/model/user.model';
import { UserRepository } from '@/repository/user.repository';
import { UserService } from '@/service/user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
