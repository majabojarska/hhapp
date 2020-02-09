import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Shop } from '../shops/shop.entity';
import { User } from '../users/user.entity';
import { ShoppingListItem } from '../shopping-list-items/shopping-list-item.entity';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name?: string;

  // Relations

  @ManyToOne(type => Shop, shop => shop.shoppingLists, {
    nullable: true,
  })
  public shop: Shop;

  @ManyToOne(type => User, user => user.shoppingLists, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @OneToMany(type => ShoppingListItem, item => item.shoppingList)
  public items: ShoppingListItem[];
}
