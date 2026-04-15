import { UserController } from '@/controller/user.controller';
import { UserRepository } from '@/repository/user.repository';
import { UserService } from '@/service/user.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
