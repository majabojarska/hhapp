import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('expenses')
@ApiUseTags('expenses')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async find() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.expensesService.findById(id);
  }

  @Post()
  async store(@Body() createExpenseDto: CreateExpenseDto) {
    const expense = await this.expensesService.create(createExpenseDto);
    return expense;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    const expense = await this.expensesService.update(id, updateExpenseDto);
    return expense;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const expense = await this.expensesService.delete(id);
    return expense;
  }
}
