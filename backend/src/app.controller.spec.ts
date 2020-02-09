import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ConfigService } from './config/config.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { PassportModule } from '@nestjs/passport';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { JwtBlacklistEntry } from './auth/jwt-blacklist-entry.entity';
const jwtBlacklistRepositoryMock = {
  find: jest.fn(),
  findOne: jest.fn(),
};
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({

    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
