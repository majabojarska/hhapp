import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Bill } from '../bills/bill.entity';

@Entity()
export class BillCalcRule {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public name?: string;

    @Column({ type: 'double' })
    public pricePerUnit?: number;

    @Column()
    public unit?: string;

    @OneToMany(
        type => Bill,
        bill => bill.billCalcRule,
        { onDelete: 'RESTRICT' },
    )
    public bills: Bill[];
}
