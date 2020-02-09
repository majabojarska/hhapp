import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillCalcRule } from './bill-calc-rule.entity';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateBillCalcRuleDto } from './dto/create-bill-calc-rule.dto';
import { UpdateBillCalcRuleDto } from './dto/update-bill-calc-rule.dto';

@Injectable()
export class BillCalcRulesService {
  constructor(
    @InjectRepository(BillCalcRule)
    private readonly billCalcRuleRepository: Repository<BillCalcRule>,
  ) {}

  async findAll(): Promise<BillCalcRule[]> {
    return await this.billCalcRuleRepository.find();
  }

  async findById(id: number): Promise<BillCalcRule | undefined> {
    const billCalcRule = await this.billCalcRuleRepository.findOne(id);
    if (!billCalcRule) {
      throw new NotFoundException();
    }
    return billCalcRule;
  }

  async create(dto: CreateBillCalcRuleDto): Promise<BillCalcRule> {
    const billCalcRule = this.billCalcRuleRepository.create(dto);
    return await this.billCalcRuleRepository.save(billCalcRule);
  }

  async update(id: number, dto: UpdateBillCalcRuleDto): Promise<BillCalcRule> {
    const billCalcRule = await this.billCalcRuleRepository.findOne(id);
    if (billCalcRule) {
      const updatedBillCalcRule = this.billCalcRuleRepository.merge(
        billCalcRule,
        dto,
      );
      return await this.billCalcRuleRepository.save(updatedBillCalcRule);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<BillCalcRule> {
    const billCalcRule = await this.billCalcRuleRepository.findOne(id);
    if (billCalcRule) {
      try {
        await this.billCalcRuleRepository.delete(id);
      } catch (error) {
        throw new NotAcceptableException();
      }
      return billCalcRule;
    } else {
      throw new NotFoundException();
    }
  }
}
