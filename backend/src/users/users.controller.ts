import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from './user.entity';
import { PurchasesService } from '../purchases/purchases.service';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { ExpensesService } from '../expenses/expenses.service';
import { BillsService } from '../bills/bills.service';

@Controller('users')
@ApiUseTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly purchasesService: PurchasesService,
    private readonly shoppingListsService: ShoppingListsService,
    private readonly expensesService: ExpensesService,
    private readonly billsService: BillsService,
  ) {}

  @Get()
  async find() {
    return this.usersService.findAll();
  }

  @Get('payments')
  async findPayments(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @AuthUser() authUser: User,
  ) {
    return this.usersService.findPayments(authUser, dateFrom, dateTo);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async store(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: User,
  ) {
    const user = await this.usersService.update(id, updateUserDto, authUser);
    return user;
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number) {
    const user = await this.usersService.delete(id);
    return user;
  }

  @Get(':id/purchases')
  async findPurchases(@Param('id') id: number) {
    return this.purchasesService.findForUser(id);
  }

  @Get(':id/shopping-lists')
  async findShoppingLists(@Param('id') id: number) {
    return this.shoppingListsService.findForUser(id);
  }

  @Get(':id/expenses')
  async findExpenses(@Param('id') id: number) {
    return this.expensesService.findForUser(id);
  }

  @Get(':id/bills')
  async findBills(@Param('id') id: number) {
    return this.billsService.findForUser(id);
  }
}
