import { Test, TestingModule } from '@nestjs/testing';
import { BillCalcRulesService } from './bill-calc-rules.service';

describe('BillCalcRulesService', () => {
  let service: BillCalcRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillCalcRulesService],
    }).compile();

    service = module.get<BillCalcRulesService>(BillCalcRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
