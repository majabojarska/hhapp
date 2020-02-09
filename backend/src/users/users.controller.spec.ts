import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { PassportModule } from '@nestjs/passport';

const userRepositoryMock = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
