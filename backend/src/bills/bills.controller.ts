import {
  Controller,
  Delete,
  Param,
  Put,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('bills')
@ApiUseTags('bills')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  async find() {
    return this.billsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.billsService.findById(id);
  }

  @Post()
  async store(@Body() createBillDto: CreateBillDto) {
    const bill = await this.billsService.create(createBillDto);
    return bill;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBillDto: UpdateBillDto) {
    const bill = await this.billsService.update(id, updateBillDto);
    return bill;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const bill = await this.billsService.delete(id);
    return bill;
  }
}
