import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateBillCalcRuleDto {
  @ApiModelProperty({ example: 'electricity', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty({ example: 0.62, type: 'double', required: false })
  @IsOptional()
  readonly pricePerUnit?: number;

  @ApiModelProperty({ example: 'kWh', required: false })
  @IsOptional()
  readonly unit?: string;
}
