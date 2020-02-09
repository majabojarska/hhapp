import { Module, forwardRef } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PassportModule } from '@nestjs/passport';
import { Purchase } from '../purchases/purchase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { ShopsModule } from '../shops/shops.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Purchase]),
    ConfigModule,
    forwardRef(() => UsersModule),
    CategoriesModule,
    ShopsModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
