import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
@ApiUseTags('categories')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async find() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoriesService.findById(id);
  }

  @Post()
  async store(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.categoriesService.delete(id);
  }
}
