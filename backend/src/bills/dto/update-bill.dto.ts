import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsNumber, IsNumberString } from 'class-validator';

export class UpdateBillDto {
  @ApiModelProperty({ example: 123, required: false })
  @IsNumber()
  @IsOptional()
  readonly value?: number;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  readonly dateFrom?: string;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  readonly dateTo?: string;

  @ApiModelProperty({ example: 123, required: false })
  @IsOptional()
  readonly billCalcRuleId?: number;

  @ApiModelProperty({ example: 44, required: false })
  @IsOptional()
  readonly userId?: number;
}
