import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Exclusion,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { JwtBlacklistEntry } from '../auth/jwt-blacklist-entry.entity';
import { User } from '../users/user.entity';
import { Purchase } from '../purchases/purchase.entity';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name?: string;

  @Column({ length: 7 })
  public color?: string;

  // Relations

  @OneToMany(type => Purchase, purchase => purchase.shop, {
    onDelete: 'RESTRICT',
  })
  public purchases: Purchase[];

  @OneToMany(type => ShoppingList, shoppingList => shoppingList.shop, {
    onDelete: 'SET NULL',
  })
  public shoppingLists: ShoppingList[];

  @ManyToOne(type => Category, category => category.id)
  public defaultCategory: Category;
}
