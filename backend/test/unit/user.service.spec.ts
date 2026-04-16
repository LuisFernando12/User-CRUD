import { IUserRepository, UserRepository } from '@/repository/user.repository';
import { UserService } from '@/service/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '../../src/dto/create-user.dto';
import { UpdateUserDTO } from '../../src/dto/update-user.dto';

describe('UserService', () => {
  const mockUserRepository: IUserRepository = {
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
    userExists: jest.fn().mockResolvedValue(false),
  };
  let userService: UserService;
  beforeEach(async () => {
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
  describe('create', () => {
    const mockUser: CreateUserDTO = {
      name: 'John Doe',
      cpf: '12345678901',
      email: 'john.doe@example.com',
      birthDate: '1990-01-01',
      phone: '(11)111111111',
    };
    it('should create a user', async () => {
      const result = await userService.create(mockUser);
      expect(result).toEqual({
        id: '1',
        name: mockUser.name,
        cpf: mockUser.cpf,
        email: mockUser.email,
        birthDate: mockUser.birthDate,
        phone: mockUser.phone,
      });
    });
    it('should throw an error if user already exists', async () => {
      mockUserRepository.userExists = jest.fn().mockResolvedValueOnce(true);
      const promise = userService.create(mockUser);
      await expect(promise).rejects.toThrow('User already exists');
    });
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await userService.findAll();
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
    it('should return an array without users', async () => {
      jest.spyOn(mockUserRepository, 'findAll').mockResolvedValueOnce([]);
      const result = await userService.findAll();
      expect(result).toEqual([]);
    });
  });
  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await userService.findOne('1');
      expect(result).toEqual({
        id: '1',
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john.doe@example.com',
        birthDate: '1990-01-01',
        phone: '(11)111111111',
      });
    });
    it('should throw an error if user is not found', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      const promise = userService.findOne('1');
      await expect(promise).rejects.toThrow('User not found');
    });
  });
  describe('update', () => {
    const mockUser: UpdateUserDTO = {
      name: 'John Doe2',
    };
    it('should update a user', async () => {
      const result = await userService.update('1', mockUser);
      expect(result).toEqual({
        affected: 1,
      });
    });
    it('should throw an error cause missing id', async () => {
      const promise = userService.update(null, mockUser);
      await expect(promise).rejects.toThrow('User ID is required');
    });
    it('should throw an error cause missing id', async () => {
      const promise = userService.update('1', {});
      await expect(promise).rejects.toThrow(
        'At least one field is required to update',
      );
    });
  });
  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await userService.remove('1');
      expect(result).toEqual({
        affected: 1,
      });
    });
    it('should throw an error cause missing id', async () => {
      const promise = userService.remove(null);
      await expect(promise).rejects.toThrow('User ID is required');
    });
    it('should throw an error if user is not found', async () => {
      mockUserRepository.remove = jest
        .fn()
        .mockResolvedValueOnce({ affected: 0 });
      const promise = userService.remove('1');
      await expect(promise).rejects.toThrow('User not found');
    });
  });
});
