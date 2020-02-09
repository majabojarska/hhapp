import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillCalcRulesService } from './bill-calc-rules.service';
import { CreateBillCalcRuleDto } from './dto/create-bill-calc-rule.dto';
import { UpdateBillCalcRuleDto } from './dto/update-bill-calc-rule.dto';

@ApiUseTags('bill-calc-rules')
@Controller('bill-calc-rules')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class BillCalcRulesController {
  constructor(private readonly billCalcRulesService: BillCalcRulesService) {}

  @Get()
  async find() {
    return this.billCalcRulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.billCalcRulesService.findById(id);
  }

  @Post()
  async store(@Body() createBillCalcRuleDto: CreateBillCalcRuleDto) {
    const billCalcRule = await this.billCalcRulesService.create(
      createBillCalcRuleDto,
    );
    return billCalcRule;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBillCalcRuleDto: UpdateBillCalcRuleDto,
  ) {
    const billCalcRule = await this.billCalcRulesService.update(
      id,
      updateBillCalcRuleDto,
    );
    return billCalcRule;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const user = await this.billCalcRulesService.delete(id);
    return user;
  }
}
