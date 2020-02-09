import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateShoppingListDto {
  @ApiModelProperty({ example: 'Groceries', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty({ example: 1, type: 'int', required: false })
  @IsOptional()
  readonly userId?: number | null;

  @ApiModelProperty({ example: 234567, type: 'int', required: false })
  @IsOptional()
  readonly shopId?: number | null;
}
