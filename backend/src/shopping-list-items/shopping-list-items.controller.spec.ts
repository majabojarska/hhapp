import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListItemsController } from './shopping-list-items.controller';

describe('ShoppingListItems Controller', () => {
  let controller: ShoppingListItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListItemsController],
    }).compile();

    controller = module.get<ShoppingListItemsController>(ShoppingListItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
