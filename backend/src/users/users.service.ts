import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository, FindManyOptions, Not, Equal, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSinglePaymentDto } from './dto/user-single-payment.dto';
import { extendMoment } from 'moment-range';

import moment from 'moment';
import * as momentToExtend from 'moment';
import { UserAllPaymentsDto } from './dto/user-all-payments.dto';
const { range } = extendMoment(momentToExtend);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return await this.userRepository.find(options);
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findForAuth(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'isAdmin'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const count = await this.userRepository.count({
      username: dto.username,
    });
    if (count === 0) {
      dto.password = await this.hashPassword(dto);
      const user = this.userRepository.create(dto);
      const savedUser = await this.userRepository.save(user);
      delete savedUser.password;
      return savedUser;
    } else {
      throw new ConflictException({
        exists: ['username'],
      });
    }
  }

  async update(id: number, dto: UpdateUserDto, updater: User): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      if (dto.password) {
        dto.password = await this.hashPassword(dto);
      }
      if (!this.canUpdate(user, dto, updater)) {
        throw new ForbiddenException();
      }
      const updatedUser = this.userRepository.merge(user, dto);
      await this.userRepository.save(updatedUser);
      delete updatedUser.password;
      return updatedUser;
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      this.userRepository.delete(user);
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async findPayments(
    authUser: User,
    dateFrom: string,
    dateTo: string,
  ): Promise<UserAllPaymentsDto> {
    const users = await this.findAll({
      relations: ['purchases', 'bills', 'expenses', 'purchasesBoughtFor'],
      where: {
        id: Not(authUser.id),
      },
    });

    authUser = (await this.findAll({
      relations: ['purchases', 'bills', 'expenses', 'purchasesBoughtFor'],
      where: {
        id: authUser.id,
      },
    }))[0];

    const paymentsPerUser = [];
    const queryMomentFrom = moment(dateFrom);
    const queryMomentTo = moment(dateTo);
    const queryMomentRange = range(queryMomentFrom, queryMomentTo);

    users.forEach(user => {
      // Purchases
      let purchasesTotal = 0;
      user.purchases.forEach(purchase => {
        if (purchase.isShared) {
          purchasesTotal -=
            (purchase.quantity * purchase.price) / (users.length + 1);
        }
      });
      user.purchasesBoughtFor.forEach(purchase => {
        if (purchase.isShared) {
          purchasesTotal +=
            (purchase.quantity * purchase.price) / (users.length + 1);
        } else if (purchase.boughtBy.id === authUser.id) {
          purchasesTotal += purchase.quantity * purchase.price;
        } else if (purchase.boughtFor.id === authUser.id) {
          purchasesTotal -= purchase.quantity * purchase.price;
        }
      });

      // Bills
      let billsTotal = 0;
      user.bills.forEach(bill => {
        const billRange = range(moment(bill.dateFrom), moment(bill.dateTo));
        if (!billRange.overlaps(queryMomentRange)) {
          return;
        }
        const billDurationDays = billRange.duration('days');
        const overlappingDurationDays = billRange
          .intersect(queryMomentRange)
          .duration('days');
        const resultBillValue =
          (bill.value * overlappingDurationDays) /
          (billDurationDays * users.length);
        billsTotal += resultBillValue;
      });

      // Expenses
      let expensesTotal = 0;
      const expensesInTimeRange = user.expenses.filter(expense => {
        const expenseMoment = moment(expense.date);
        return queryMomentRange.contains(expenseMoment);
      });
      expensesInTimeRange.forEach(expense => {
        expensesTotal += expense.price / (users.length + 1);
      });

      ['purchases', 'expenses', 'bills', 'purchasesBoughtFor'].forEach(
        p => delete user[p],
      );

      const paymentTotal = purchasesTotal + billsTotal + expensesTotal;
      const userSinglePaymentDto = new UserSinglePaymentDto(user, paymentTotal);
      paymentsPerUser.push(userSinglePaymentDto);
    });

    const paymentsDto: UserAllPaymentsDto = {
      payments: paymentsPerUser,
    };

    authUser.bills.forEach(bill => {
      const billRange = range(moment(bill.dateFrom), moment(bill.dateTo));
      if (!billRange.overlaps(queryMomentRange)) {
        return;
      }
      const billDurationDays = billRange.duration('days');
      const overlappingDurationDays = billRange
        .intersect(queryMomentRange)
        .duration('days');
      const resultBillValue =
        (bill.value * overlappingDurationDays) /
        (billDurationDays * users.length);
      paymentsDto.payments.forEach(
        (payment, i) =>
          (paymentsDto.payments[i].paymentTotal -=
            resultBillValue / (users.length + 1)),
      );
    });

    authUser.expenses.forEach(expense => {
      if (queryMomentRange.contains(moment(expense.date))) {
        paymentsDto.payments.forEach(
          (payment, i) =>
            (paymentsDto.payments[i].paymentTotal -=
              expense.price / (users.length + 1)),
        );
      }
    });

    return paymentsDto;
  }

  private async hashPassword(
    dto: CreateUserDto | UpdateUserDto,
  ): Promise<string> {
    const salt = await bcryptjs.genSalt();
    return bcryptjs.hash(dto.password, salt);
  }

  private canUpdate(user: User, dto: UpdateUserDto, updater: User) {
    /** TODO: Concat this */
    if (updater.isAdmin) {
      return true;
    }
    if (updater.id !== user.id) {
      return false;
    }
    if (updater.isAdmin !== user.isAdmin) {
      return false;
    }
    return true;
  }

  private;
}
