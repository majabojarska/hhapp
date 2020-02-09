import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Purchase } from '../purchases/purchase.entity';
import { Shop } from '../shops/shop.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name?: string;

  @Column({ length: 7 })
  public color?: string;

  @Column({ type: 'bool', default: false, nullable: false })
  public isShared?: boolean;

  // Relations

  @OneToMany(type => Purchase, purchase => purchase.category, {
    onDelete: 'RESTRICT',
  })
  public purchases: Purchase[];

  @OneToMany(type => Shop, shop => shop.defaultCategory, {
    onDelete: 'RESTRICT',
  })
  public shops: Shop[];
}
