import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateShopDto {
  @ApiModelProperty({ example: 'Froggie', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty({ format: 'Hex', example: '#BADA55', required: false })
  @IsOptional()
  readonly color?: string;

  @ApiModelProperty({ example: 22, type: 'int', required: false })
  @IsOptional()
  readonly defaultCategoryId?: number|null;
}
