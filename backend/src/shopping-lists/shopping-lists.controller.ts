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
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ShoppingListsService } from './shopping-lists.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { ShoppingListItemsService } from '../shopping-list-items/shopping-list-items.service';
import { ToPurchasesDto } from './dto/to-purchases.dto';
@Controller('shopping-lists')
@ApiUseTags('shopping-lists')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ShoppingListsController {
  constructor(
    private readonly shoppingListsService: ShoppingListsService,
    private readonly shoppingListItemsService: ShoppingListItemsService,
  ) {}

  @Get()
  async find() {
    return this.shoppingListsService.findAll();
  }

  @Get(':id/shopping-list-items')
  async findItems(@Param('id') id: number) {
    return this.shoppingListItemsService.findForList(id);
  }

  @Post(':id/to-purchases')
  async toPurchases(
    @Param('id') id: number,
    @Body() toPurchaseDto: ToPurchasesDto,
  ) {
    return this.shoppingListsService.toPurchases(id, toPurchaseDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.shoppingListsService.findById(id);
  }

  @Post()
  async store(@Body() createShoppingListDto: CreateShoppingListDto) {
    const shoppingList = await this.shoppingListsService.create(
      createShoppingListDto,
    );
    return shoppingList;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateShoppingListDto: UpdateShoppingListDto,
  ) {
    const user = await this.shoppingListsService.update(
      id,
      updateShoppingListDto,
    );
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.shoppingListsService.delete(id);
  }
}
