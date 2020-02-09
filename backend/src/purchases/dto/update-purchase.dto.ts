import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePurchaseDto {
  @ApiModelProperty({ example: 'Herbs', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty({ example: 4.2, type: 'double', required: false })
  @IsOptional()
  readonly price?: number;

  @ApiModelProperty({ example: 2.13, type: 'double', required: false })
  @IsOptional()
  readonly quantity?: number;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  readonly date?: string;

  @ApiModelProperty({ example: false, default: false, required: false })
  @IsBoolean()
  @IsOptional()
  readonly isShared?: boolean;

  @ApiModelProperty({ example: 2, type: 'int', required: false })
  @IsOptional()
  readonly boughtById?: number;

  @ApiModelProperty({ example: 3, type: 'int', required: false })
  @IsOptional()
  readonly boughtForId?: number;

  @ApiModelProperty({ example: 64, type: 'int', required: false })
  @IsOptional()
  readonly categoryId?: number;

  @ApiModelProperty({ example: 21, type: 'int', required: false })
  @IsOptional()
  readonly shopId?: number;
}
