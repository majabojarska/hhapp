import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { ConfigService } from '../config/config.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { JwtBlacklistEntry } from './jwt-blacklist-entry.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';

const userRepositoryMock = {
  find: jest.fn(),
  findOne: jest.fn(),
};

const jwtBlacklistRepositoryMock = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
