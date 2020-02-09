import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory, JwtOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      keepConnectionAlive: true,
      retryAttempts: 3,
      retryDelay: 1000,
      logging: true,
      charset: 'utf8mb4_unicode_ci',
    };
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    };
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }
}
