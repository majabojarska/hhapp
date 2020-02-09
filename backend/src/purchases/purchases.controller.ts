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
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchasesService } from './purchases.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('purchases')
@ApiUseTags('purchases')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async find() {
    return this.purchasesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.purchasesService.findById(id);
  }

  @Post()
  async store(@Body() createPurchaseDto: CreatePurchaseDto) {
    const purchase = await this.purchasesService.create(createPurchaseDto);
    return purchase;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    const purchase = await this.purchasesService.update(id, updatePurchaseDto);
    return purchase;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const purchase = await this.purchasesService.delete(id);
    return purchase;
  }
}
