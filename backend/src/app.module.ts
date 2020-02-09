import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BillsModule } from './bills/bills.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CategoriesModule } from './categories/categories.module';
import { ShopsModule } from './shops/shops.module';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { BillCalcRulesModule } from './bill-calc-rules/bill-calc-rules.module';
import { StatsController } from './stats/stats.controller';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    ExpensesModule,
    BillCalcRulesModule,
    PurchasesModule,
    CategoriesModule,
    ShopsModule,
    ShoppingListsModule,
    UsersModule,
    StatsModule,
  ],
  controllers: [AppController, StatsController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
