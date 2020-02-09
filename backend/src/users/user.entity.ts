import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Exclusion,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { JwtBlacklistEntry } from '../auth/jwt-blacklist-entry.entity';
import { Expense } from '../expenses/expense.entity';
import { Bill } from '../bills/bill.entity';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import { Purchase } from '../purchases/purchase.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public username?: string;

  @Column({ select: false })
  public password?: string;

  @Column()
  public firstname?: string;

  @Column()
  public surname?: string;

  @Column({ length: 7 })
  public color?: string;

  @Column({ type: 'datetime', nullable: false })
  public dateOfBirth?: string;

  @Column({ type: 'bool', default: false, nullable: false })
  public isAdmin: boolean;

  // Relations

  @OneToMany(
    type => JwtBlacklistEntry,
    jwtBlacklistEntry => jwtBlacklistEntry.user,
  )
  public jwtBlacklistEntries: JwtBlacklistEntry[];

  @OneToMany(type => Expense, expense => expense.user)
  public expenses: Expense[];

  @OneToMany(type => Bill, bill => bill.user)
  public bills: Bill[];

  @OneToMany(type => ShoppingList, list => list.user, { onDelete: 'SET NULL' })
  public shoppingLists: ShoppingList[];

  @OneToMany(type => Purchase, purchase => purchase.boughtBy, {
    onDelete: 'CASCADE',
  })
  public purchases: Purchase[];

  @OneToMany(type => Purchase, purchase => purchase.boughtFor, {
    onDelete: 'SET NULL',
  })
  public purchasesBoughtFor: Purchase[];
}
