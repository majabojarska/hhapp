import { ApiModelProperty } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiModelProperty({ example: 'Froggie' })
  readonly name: string;

  @ApiModelProperty({ format: 'Hex', example: '#BADA55' })
  readonly color: string;

  @ApiModelProperty({
    example: 22,
    type: 'int',
    required: false,
    default: null,
  })
  readonly defaultCategoryId: number;
}
