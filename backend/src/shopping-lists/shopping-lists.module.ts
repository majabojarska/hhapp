import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { Module, forwardRef } from '@nestjs/common';
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingList } from './shopping-list.entity';
import { UsersModule } from '../users/users.module';
import { ShopsModule } from '../shops/shops.module';
import { ShoppingListItemsModule } from '../shopping-list-items/shopping-list-items.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([ShoppingList]),
    ConfigModule,
    forwardRef(() => UsersModule),
    ShopsModule,
    ShoppingListItemsModule,
  ],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService],
  exports: [ShoppingListsService, ShoppingListItemsModule],
})
export class ShoppingListsModule {}
