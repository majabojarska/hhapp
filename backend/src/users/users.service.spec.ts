import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const userRepositoryMock = {
  find: jest.fn(() => [new User()]),
  findOne: jest.fn(() => new User()),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository methods', async () => {
    await service.findAll();
    expect(userRepositoryMock.find).toHaveBeenCalledTimes(1);
    await service.findById(1);
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
  });
});
