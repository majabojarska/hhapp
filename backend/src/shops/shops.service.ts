import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShoppingListItemDto } from '../shopping-list-items/dto/update-shopping-list-item.dto';
import { CategoriesService } from '../categories/categories.service';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.find({relations: ['defaultCategory']});
  }

  async findById(id: number): Promise<Shop | undefined> {
    const shop = await this.shopRepository.findOne(id);
    if (!shop) {
      throw new NotFoundException();
    }
    return shop;
  }

  async create(dto: CreateShopDto): Promise<Shop> {
    const shop = this.shopRepository.create(dto);
    if (dto.defaultCategoryId) {
      const category = await this.categoriesService.findById(
        dto.defaultCategoryId,
      );
      shop.defaultCategory = category;
    }
    return this.shopRepository.save(shop);
  }

  async update(id: number, dto: UpdateShopDto): Promise<Shop> {
    const shop = await this.shopRepository.findOne(id);
    if (shop) {
      if (dto.defaultCategoryId == null) {
        shop.defaultCategory = null;
      } else if (dto.defaultCategoryId) {
        const category = await this.categoriesService.findById(
          dto.defaultCategoryId,
        );
        shop.defaultCategory = category;
      }
      const updatedShop = this.shopRepository.merge(shop, dto);
      return this.shopRepository.save(updatedShop);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<Shop> {
    const shop = await this.shopRepository.findOne(id);
    if (shop) {
      try {
        await this.shopRepository.delete(id);
      } catch (error) {
        throw new NotAcceptableException();
      }
      return shop;
    } else {
      throw new NotFoundException();
    }
  }
}
