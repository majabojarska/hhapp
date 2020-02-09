import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Transaction,
  TransactionManager,
  EntityManager,
  TransactionRepository,
} from 'typeorm';
import { ShoppingList } from './shopping-list.entity';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UsersService } from '../users/users.service';
import { ShopsService } from '../shops/shops.service';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { ToPurchasesDto } from './dto/to-purchases.dto';
import { Purchase } from '../purchases/purchase.entity';
import { User } from '../users/user.entity';
import { Shop } from '../shops/shop.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
    private readonly usersService: UsersService,
    private readonly shopsService: ShopsService,
  ) {}

  async findAll(): Promise<ShoppingList[]> {
    return await this.shoppingListRepository.find({
      relations: ['shop', 'shop.defaultCategory', 'user', 'items'],
    });
  }

  async findById(id: number): Promise<ShoppingList | undefined> {
    const shoppingList = await this.shoppingListRepository.findOne(id);
    if (!shoppingList) {
      throw new NotFoundException();
    }
    return shoppingList;
  }

  async create(dto: CreateShoppingListDto): Promise<ShoppingList> {
    const shoppingList = this.shoppingListRepository.create(dto);
    if (dto.userId) {
      const user = await this.usersService.findById(dto.userId);
      shoppingList.user = user;
    }
    if (dto.shopId) {
      const shop = await this.shopsService.findById(dto.shopId);
      shoppingList.shop = shop;
    }

    return await this.shoppingListRepository.save(shoppingList);
  }

  async update(id: number, dto: UpdateShoppingListDto): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListRepository.findOne(id);
    if (shoppingList) {
      if (dto.userId == null) {
        shoppingList.user = null;
      } else if (dto.userId) {
        const user = await this.usersService.findById(dto.userId);
        shoppingList.user = user;
      }
      if (dto.shopId == null) {
        shoppingList.shop = null;
      } else if (dto.shopId) {
        const shop = await this.shopsService.findById(dto.shopId);
        shoppingList.shop = shop;
      }
      const updatedShoppingList = this.shoppingListRepository.merge(
        shoppingList,
        dto,
      );
      return this.shoppingListRepository.save(updatedShoppingList);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListRepository.findOne(id);
    if (shoppingList) {
      this.shoppingListRepository.delete(shoppingList);
      return shoppingList;
    } else {
      throw new NotFoundException();
    }
  }

  async findForUser(userId: number): Promise<ShoppingList[]> {
    return this.shoppingListRepository.find({
      where: { user: await this.usersService.findById(userId) },
    });
  }

  @Transaction()
  async toPurchases(
    id: number,
    dto: ToPurchasesDto,
    @TransactionRepository(User) userRepository?: Repository<User>,
    @TransactionRepository(Purchase) purchaseRepository?: Repository<Purchase>,
    @TransactionRepository(Shop) shopRepository?: Repository<Shop>,
    @TransactionRepository(Category) categoryRepository?: Repository<Category>,
    @TransactionRepository(ShoppingList)
    shoppingListRepository?: Repository<ShoppingList>,
  ): Promise<void> {
    const shoppingList = await this.findById(id);
    try {
      for (const purchaseDto of dto.purchases) {
        const purchase = purchaseRepository.create(purchaseDto);

        const boughtByUser = await userRepository.findOne(
          purchaseDto.boughtById,
        );
        let boughtForUser = null;
        if (purchaseDto.boughtForId) {
          boughtForUser = await userRepository.findOne(purchaseDto.boughtForId);
        }
        const shop = await shopRepository.findOne(purchaseDto.shopId);
        const category = await categoryRepository.findOne(
          purchaseDto.categoryId,
        );

        // purchase.name = 'DefaultName';
        // purchase.price = 123;
        // purchase.quantity = 1;
        // purchase.date = '1973-10-05T00:00:00.000Z';

        purchase.boughtBy = boughtByUser;
        purchase.boughtFor = boughtForUser;
        purchase.shop = shop;
        purchase.category = category;
        await purchaseRepository.save(purchase);
      }
      await shoppingListRepository.delete(shoppingList);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
