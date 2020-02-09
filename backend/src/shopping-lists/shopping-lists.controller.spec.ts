import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListsController } from './shopping-lists.controller';

describe('ShoppingLists Controller', () => {
  let controller: ShoppingListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListsController],
    }).compile();

    controller = module.get<ShoppingListsController>(ShoppingListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
