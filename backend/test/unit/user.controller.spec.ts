import { IUserService, UserService } from '@/service/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/controller/user.controller';
import { CreateUserDTO } from '../../src/dto/create-user.dto';
import { UpdateUserDTO } from '../../src/dto/update-user.dto';

describe('UserController', () => {
  const mockUserService: IUserService = {
    create: jest.fn().mockResolvedValue({
      id: '1',
      name: 'John Doe',
      cpf: '12345678901',
      email: 'john.doe@example.com',
      birthDate: '1990-01-01',
      phone: '(11)111111111',
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john.doe@example.com',
        birthDate: '1990-01-01',
        phone: '(11)111111111',
      },
      {
        id: '2',
        name: 'Joana Doe',
        cpf: '12345678922',
        email: 'joana.doe@example.com',
        birthDate: '1990-01-01',
        phone: '(11)111111111',
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: '1',
      name: 'John Doe',
      cpf: '12345678901',
      email: 'john.doe@example.com',
      birthDate: '1990-01-01',
      phone: '(11)111111111',
    }),
    update: jest.fn().mockResolvedValue({
      affected: 1,
    }),
    remove: jest.fn().mockResolvedValue({
      affected: 1,
    }),
  };
  let userController: UserController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    userController = module.get<UserController>(UserController);
  });
  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  describe('create', () => {
    const mockUser: CreateUserDTO = {
      name: 'John Doe',
      cpf: '12345678901',
      email: 'john.doe@example.com',
      birthDate: '1990-01-01',
      phone: '(11)111111111',
    };
    it('should create a user', async () => {
      const result = await userController.create(mockUser);
      expect(result).toEqual({
        id: '1',
        name: mockUser.name,
        cpf: mockUser.cpf,
        email: mockUser.email,
        birthDate: mockUser.birthDate,
        phone: mockUser.phone,
      });
    });
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await userController.findAll();
      expect(result).toEqual([
        {
          id: '1',
          name: 'John Doe',
          cpf: '12345678901',
          email: 'john.doe@example.com',
          birthDate: '1990-01-01',
          phone: '(11)111111111',
        },
        {
          id: '2',
          name: 'Joana Doe',
          cpf: '12345678922',
          email: 'joana.doe@example.com',
          birthDate: '1990-01-01',
          phone: '(11)111111111',
        },
      ]);
    });
  });
  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await userController.findOne('1');
      expect(result).toEqual({
        id: '1',
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john.doe@example.com',
        birthDate: '1990-01-01',
        phone: '(11)111111111',
      });
    });
  });
  describe('update', () => {
    const mockUser: UpdateUserDTO = {
      name: 'John Doe2',
    };
    it('should update a user', async () => {
      const result = await userController.update('1', mockUser);
      expect(result).toEqual({
        affected: 1,
      });
    });
  });
  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await userController.remove('1');
      expect(result).toEqual({
        affected: 1,
      });
    });
  });
});
