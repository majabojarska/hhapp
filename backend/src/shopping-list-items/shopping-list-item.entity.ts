import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';

@Entity()
export class ShoppingListItem {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name?: string;

  @Column({ type: 'double' })
  public quantity?: number;

  // Relations

  @ManyToOne(type => ShoppingList, list => list.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  public shoppingList: ShoppingList;
}
