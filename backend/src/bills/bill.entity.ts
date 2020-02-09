import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BillCalcRule } from '../bill-calc-rules/bill-calc-rule.entity';
import { User } from '../users/user.entity';
@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ type: 'double' })
  public value?: number;

  @Column({ type: 'datetime' })
  public dateFrom?: string;

  @Column({ type: 'datetime' })
  public dateTo?: string;

  // Relations

  @ManyToOne(type => BillCalcRule, rule => rule.bills, { nullable: false })
  public billCalcRule: BillCalcRule;

  @ManyToOne(type => User, user => user.bills, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  public user: User;
}
