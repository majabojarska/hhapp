import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListItemsService } from './shopping-list-items.service';

describe('ShoppingListItemsService', () => {
  let service: ShoppingListItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingListItemsService],
    }).compile();

    service = module.get<ShoppingListItemsService>(ShoppingListItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
