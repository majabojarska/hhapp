import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601, IsBoolean, IsOptional } from 'class-validator';

export class CreatePurchaseDto {
  @ApiModelProperty({ example: 'Herbs' })
  readonly name: string;

  @ApiModelProperty({ example: 4.2, type: 'double' })
  readonly price: number;

  @ApiModelProperty({ example: 2.13, type: 'double' })
  readonly quantity: number;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
  })
  @IsISO8601()
  readonly date: string;

  @ApiModelProperty({ example: false, default: false, required: false })
  @IsBoolean()
  @IsOptional()
  readonly isShared?: boolean;

  @ApiModelProperty({ example: 2, type: 'int' })
  readonly boughtById: number;

  @ApiModelProperty({ example: 3, type: 'int' })
  readonly boughtForId: number;

  @ApiModelProperty({ example: 64, type: 'int' })
  readonly categoryId: number;

  @ApiModelProperty({ example: 21, type: 'int' })
  readonly shopId: number;
}
