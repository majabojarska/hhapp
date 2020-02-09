import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtBlacklistEntry } from './jwt-blacklist-entry.entity';

const userRepositoryMock = {
  find: jest.fn(),
  findOne: jest.fn(),
};

const jwtBlacklistRepositoryMock = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
