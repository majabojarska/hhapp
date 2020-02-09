import { ApiModelProperty } from '@nestjs/swagger';

export class CreateBillCalcRuleDto {
  @ApiModelProperty({ example: 'electricity' })
  readonly name: string;

  @ApiModelProperty({ example: 0.62, type: 'double' })
  readonly pricePerUnit: number;

  @ApiModelProperty({ example: 'kWh' })
  readonly unit: string;
}
