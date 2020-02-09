import { ApiModelProperty } from '@nestjs/swagger';

export class CreateShoppingListItemDto {
  @ApiModelProperty({ example: 'Juice' })
  readonly name: string;

  @ApiModelProperty({ example: 4, type: 'int' })
  readonly quantity: number;

  @ApiModelProperty({ example: 2, type: 'int' })
  readonly shoppingListId: number;
}
