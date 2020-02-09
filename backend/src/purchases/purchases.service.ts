import { Injectable, NotFoundException, Body } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { ShopsService } from '../shops/shops.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly shopsService: ShopsService,
  ) {}

  async findAll(): Promise<Purchase[]> {
    return await this.purchaseRepository.find();
  }

  async findById(id: number): Promise<Purchase | undefined> {
    const purchase = await this.purchaseRepository.findOne(id);
    if (!purchase) {
      throw new NotFoundException();
    }
    return purchase;
  }

  async create(dto: CreatePurchaseDto): Promise<Purchase> {
    const purchase = this.purchaseRepository.create(dto);

    const boughtByUser = await this.usersService.findById(dto.boughtById);
    let boughtForUser = null;
    if (dto.boughtForId) {
      boughtForUser = await this.usersService.findById(dto.boughtForId);
    }
    const shop = await this.shopsService.findById(dto.shopId);
    const category = await this.categoriesService.findById(dto.categoryId);

    purchase.boughtBy = boughtByUser;
    purchase.boughtFor = boughtForUser;
    purchase.shop = shop;
    purchase.category = category;

    return await this.purchaseRepository.save(purchase);
  }

  async update(id: number, dto: UpdatePurchaseDto): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne(id);
    if (purchase) {
      if (dto.boughtById) {
        const boughtByUser = await this.usersService.findById(dto.boughtById);
        purchase.boughtBy = boughtByUser;
      }
      if (dto.boughtForId) {
        const boughtForUser = await this.usersService.findById(dto.boughtForId);
        purchase.boughtFor = boughtForUser;
      } else if (dto.boughtForId === null) {
        purchase.boughtFor = null;
      }
      if (dto.shopId) {
        const shop = await this.shopsService.findById(dto.shopId);
        purchase.shop = shop;
      }
      if (dto.categoryId) {
        const category = await this.categoriesService.findById(dto.categoryId);
        purchase.category = category;
      }
      const updatedPurchase = this.purchaseRepository.merge(purchase, dto);
      return await this.purchaseRepository.save(updatedPurchase);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne(id);
    if (purchase) {
      this.purchaseRepository.delete(id);
      return purchase;
    } else {
      throw new NotFoundException();
    }
  }

  async findForUser(userId: number): Promise<Purchase[]> {
    return this.purchaseRepository.find({
      where: {
        boughtBy: await this.usersService.findById(userId),
      },
    });
  }
}
