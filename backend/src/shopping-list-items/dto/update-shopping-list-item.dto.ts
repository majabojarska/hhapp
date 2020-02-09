import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateShoppingListItemDto {
  @ApiModelProperty({ example: 'Juice', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty({ example: 4, type: 'int', required: false })
  @IsOptional()
  readonly quantity?: number;

  @ApiModelProperty({ example: 2, type: 'int', required: false })
  @IsOptional()
  readonly shoppingListId?: number;
}
