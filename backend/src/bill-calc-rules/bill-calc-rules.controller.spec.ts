import { Test, TestingModule } from '@nestjs/testing';
import { BillCalcRulesController } from './bill-calc-rules.controller';

describe('BillCalcRules Controller', () => {
  let controller: BillCalcRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillCalcRulesController],
    }).compile();

    controller = module.get<BillCalcRulesController>(BillCalcRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
