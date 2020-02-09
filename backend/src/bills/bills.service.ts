import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './bill.entity';
import { Repository } from 'typeorm';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { BillCalcRulesService } from '../bill-calc-rules/bill-calc-rules.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    private readonly billCalcRulesService: BillCalcRulesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Bill[]> {
    return await this.billRepository.find({relations: ['billCalcRule']});
  }

  async findById(id: number): Promise<Bill | undefined> {
    const bill = await this.billRepository.findOne(id);
    if (!bill) {
      throw new NotFoundException();
    }
    return bill;
  }

  async create(dto: CreateBillDto): Promise<Bill> {
    const billCalcRule = await this.billCalcRulesService.findById(
      dto.billCalcRuleId,
    );
    const user = await this.usersService.findById(dto.userId);

    const createdBill = this.billRepository.create(dto);
    createdBill.billCalcRule = billCalcRule;
    createdBill.user = user;
    return await this.billRepository.save(createdBill);
  }

  async update(id: number, dto: UpdateBillDto): Promise<Bill> {
    const bill = await this.billRepository.findOne(id);
    if (bill) {
      if (dto.billCalcRuleId) {
        const billCalcRule = await this.billCalcRulesService.findById(
          dto.billCalcRuleId,
        );
        bill.billCalcRule = billCalcRule;
      }
      if (dto.userId) {
        const user = await this.usersService.findById(dto.userId);
        bill.user = user;
      }
      const updatedBill = this.billRepository.merge(bill, dto);
      return await this.billRepository.save(updatedBill);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<Bill> {
    const bill = await this.billRepository.findOne(id);
    if (bill) {
      this.billRepository.delete(bill);
      return bill;
    } else {
      throw new NotFoundException();
    }
  }

  async findForUser(userId: number): Promise<Bill[]> {
    return this.billRepository.find({
      where: { user: await this.usersService.findById(userId) },
    });
  }
}
