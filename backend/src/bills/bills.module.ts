import { Module, forwardRef } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { BillCalcRulesModule } from '../bill-calc-rules/bill-calc-rules.module';
import { PassportModule } from '@nestjs/passport';
import { Bill } from './bill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Bill]),
    ConfigModule,
    forwardRef(() => UsersModule),
    forwardRef(() => BillCalcRulesModule),
  ],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}
