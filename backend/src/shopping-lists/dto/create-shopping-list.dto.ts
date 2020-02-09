import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateShoppingListDto {
  @ApiModelProperty({ example: 'Groceries' })
  readonly name: string;

  @ApiModelProperty({ example: 1, type: 'int', required: false })
  @IsOptional()
  readonly userId?: number | null;

  @ApiModelProperty({ example: 2137, type: 'int', required: false })
  @IsOptional()
  readonly shopId?: number | null;
}
