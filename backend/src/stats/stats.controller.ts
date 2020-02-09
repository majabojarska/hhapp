import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('stats')
@ApiUseTags('stats')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/')
  async findStats(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('sharedOnly') sharedOnly: string,
  ) {
    return this.statsService.findStats(dateFrom, dateTo, sharedOnly === 'true');
  }
}
