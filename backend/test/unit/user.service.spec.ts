import { IUserRepository, UserRepository } from '@/repository/user.repository';
import { UserService } from '@/service/user.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserService', () => {
  let userService: UserService;
  beforeEach(async () => {
    const mockUserRepository: IUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
