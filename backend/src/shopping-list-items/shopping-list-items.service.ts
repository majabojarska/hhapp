import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingListItem } from './shopping-list-item.entity';
import { CreateShoppingListItemDto } from './dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from './dto/update-shopping-list-item.dto';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';

@Injectable()
export class ShoppingListItemsService {
  constructor(
    @InjectRepository(ShoppingListItem)
    private readonly shoppingListItemRepository: Repository<ShoppingListItem>,
    private readonly shoppingListsService: ShoppingListsService,
  ) {}

  async findAll(): Promise<ShoppingListItem[]> {
    return await this.shoppingListItemRepository.find();
  }

  async findForList(id: number): Promise<ShoppingListItem[]> {
    return this.shoppingListItemRepository.find({
      where: {
        shoppingList: await this.shoppingListsService.findById(id),
      },
    });
  }

  async findById(id: number): Promise<ShoppingListItem | undefined> {
    const shoppingListItem = await this.shoppingListItemRepository.findOne(id);
    if (!shoppingListItem) {
      throw new NotFoundException();
    }
    return shoppingListItem;
  }

  async create(dto: CreateShoppingListItemDto): Promise<ShoppingListItem> {
    const shoppingList = await this.shoppingListsService.findById(
      dto.shoppingListId,
    );
    const shoppingListItem = this.shoppingListItemRepository.create(dto);
    shoppingListItem.shoppingList = shoppingList;
    return await this.shoppingListItemRepository.save(shoppingListItem);
  }

  async update(
    id: number,
    dto: UpdateShoppingListItemDto,
  ): Promise<ShoppingListItem> {
    const shoppingListItem = await this.shoppingListItemRepository.findOne(id);
    if (shoppingListItem) {
      if (dto.shoppingListId) {
        const shoppingList = await this.shoppingListsService.findById(
          dto.shoppingListId,
        );
        shoppingListItem.shoppingList = shoppingList;
      }
      const updatedShoppingListItem = this.shoppingListItemRepository.merge(
        shoppingListItem,
        dto,
      );
      return await this.shoppingListItemRepository.save(
        updatedShoppingListItem,
      );
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<ShoppingListItem> {
    const shoppingListItem = await this.shoppingListItemRepository.findOne(id);
    if (shoppingListItem) {
      await this.shoppingListItemRepository.delete(shoppingListItem);
      return shoppingListItem;
    } else {
      throw new NotFoundException();
    }
  }
}
