import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PurchasesModule,
  ],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
