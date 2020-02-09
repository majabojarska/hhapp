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
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ShoppingListItemsService } from './shopping-list-items.service';
import { CreateShoppingListItemDto } from './dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from './dto/update-shopping-list-item.dto';

@Controller('shopping-list-items')
@ApiUseTags('shopping-list-items')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ShoppingListItemsController {
  constructor(
    private readonly shoppingListItemsService: ShoppingListItemsService,
  ) {}

  @Get()
  async find() {
    return this.shoppingListItemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.shoppingListItemsService.findById(id);
  }

  @Post()
  async store(@Body() createShoppingListItemDto: CreateShoppingListItemDto) {
    const shoppingListItem = await this.shoppingListItemsService.create(
      createShoppingListItemDto,
    );
    return shoppingListItem;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateShoppingListItemDto: UpdateShoppingListItemDto,
  ) {
    const shoppingListItem = await this.shoppingListItemsService.update(
      id,
      updateShoppingListItemDto,
    );
    return shoppingListItem;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const shoppingListItem = await this.shoppingListItemsService.delete(id);
    return shoppingListItem;
  }
}
