import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Exclusion,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ nullable: false })
  public name?: string;

  @Column({ type: 'double' })
  public price?: number;

  @Column({ type: 'datetime', nullable: false })
  public date?: string;

  @ManyToOne(type => User, user => user.expenses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  public user: User;
}
