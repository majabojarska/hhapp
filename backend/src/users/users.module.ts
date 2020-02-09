import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '../config/config.module';
import { PassportModule } from '@nestjs/passport';
import { PurchasesModule } from '../purchases/purchases.module';
import { ShoppingListsModule } from '../shopping-lists/shopping-lists.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { BillCalcRulesModule } from '../bill-calc-rules/bill-calc-rules.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    PurchasesModule,
    ShoppingListsModule,
    ExpensesModule,
    BillCalcRulesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
