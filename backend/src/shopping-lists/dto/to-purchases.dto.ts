import { ApiModelProperty } from '@nestjs/swagger';
import { CreatePurchaseDto } from '../../purchases/dto/create-purchase.dto';

export class ToPurchasesDto {
  @ApiModelProperty({
    example: '[CreatePurchaseDto[, CreatePurchaseDto]]',
    description: 'Array of purchase data transfer objects',
  })
  readonly purchases: CreatePurchaseDto[] = [];
}
