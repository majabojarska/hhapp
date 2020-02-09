import { Module, forwardRef } from '@nestjs/common';
import { ShoppingListItemsController } from './shopping-list-items.controller';
import { ShoppingListItemsService } from './shopping-list-items.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ShoppingListItem } from './shopping-list-item.entity';
import { ShoppingListsModule } from '../shopping-lists/shopping-lists.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([ShoppingListItem]),
    ConfigModule,
    forwardRef(() => ShoppingListsModule),
  ],
  controllers: [ShoppingListItemsController],
  providers: [ShoppingListItemsService],
  exports: [ShoppingListItemsService],
})
export class ShoppingListItemsModule {}
/*
 /\     /\
{  `---'  }
{  O   O  }
~~>  V  <~~
 \  \|/  /
  `-----'__
  /     \  `^\_
 {       }\ |\_\_   W
 |  \_/  |/ /  \_\_( )
  \__/  /(_E     \__/
    (  /
     MM
*/
