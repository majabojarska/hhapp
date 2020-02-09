import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateShopDto } from './dto/create-shop.dto';
import { ShopsService } from './shops.service';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller('shops')
@ApiUseTags('shops')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  async find() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.shopsService.findById(id);
  }

  @Post()
  async store(@Body() createShopDto: CreateShopDto) {
    return await this.shopsService.create(createShopDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateShopDto: UpdateShopDto) {
    return await this.shopsService.update(id, updateShopDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.shopsService.delete(id);
  }
}
