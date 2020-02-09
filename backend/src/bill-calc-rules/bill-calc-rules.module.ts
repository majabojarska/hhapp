import { Module } from '@nestjs/common';
import { BillCalcRulesController } from './bill-calc-rules.controller';
import { BillCalcRulesService } from './bill-calc-rules.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { BillCalcRule } from './bill-calc-rule.entity';
import { BillsModule } from '../bills/bills.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([BillCalcRule]),
    ConfigModule,
    BillsModule,
  ],
  controllers: [BillCalcRulesController],
  providers: [BillCalcRulesService],
  exports: [BillCalcRulesService, BillsModule],
})
export class BillCalcRulesModule {}
