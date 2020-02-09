import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Expense[]> {
    return await this.expenseRepository.find();
  }

  async findById(id: number): Promise<Expense | undefined> {
    const expense = await this.expenseRepository.findOne(id);
    if (!expense) {
      throw new NotFoundException();
    }
    return expense;
  }

  async create(dto: CreateExpenseDto): Promise<Expense> {
    const user = await this.usersService.findById(dto.userId);
    const createdExpense = this.expenseRepository.create(dto);
    createdExpense.user = user;
    return await this.expenseRepository.save(createdExpense);
  }

  async update(id: number, dto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.expenseRepository.findOne(id);
    if (expense) {
      if (dto.userId) {
        const user = await this.usersService.findById(dto.userId);
        expense.user = user;
      }
      const updatedExpense = this.expenseRepository.merge(expense, dto);
      return this.expenseRepository.save(updatedExpense);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne(id);
    if (expense) {
      this.expenseRepository.delete(id);
      return expense;
    } else {
      throw new NotFoundException();
    }
  }

  async findForUser(userId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: await this.usersService.findById(userId) },
    });
  }
}
