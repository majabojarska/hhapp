import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  public id?: number;
  @Column()
  public name?: string;
  @Column({ type: 'double' })
  public price?: number;
  @Column({ type: 'double' })
  public quantity?: number;
  @Column({ type: 'datetime', nullable: false })
  public date?: string;
  @Column({ type: 'bool', default: false, nullable: false })
  public isShared?: boolean;
  /* Relations */
  @ManyToOne(type => User, user => user.purchases, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  public boughtBy?: User;
  @ManyToOne(type => User, user => user.purchasesBoughtFor, { eager: true })
  public boughtFor?: User;
  @ManyToOne(type => Category, category => category.purchases, {
    nullable: false,
    eager: true,
  })
  public category: Category;
  @ManyToOne(type => Shop, shop => shop.purchases, {
    nullable: false,
    eager: true,
  })
  public shop: Shop;
}
