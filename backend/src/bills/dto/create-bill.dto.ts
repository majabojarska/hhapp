import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601, IsNumber, IsNumberString } from 'class-validator';

export class CreateBillDto {
  @IsNumber()
  @ApiModelProperty({ example: 123 })
  readonly value: number;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
  })
  @IsISO8601()
  readonly dateFrom: string;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
  })
  @IsISO8601()
  readonly dateTo: string;

  @ApiModelProperty({ example: 123 })
  readonly billCalcRuleId: number;

  @ApiModelProperty({ example: 44 })
  readonly userId: number;
}
