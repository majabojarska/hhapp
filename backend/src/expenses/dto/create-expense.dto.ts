import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';

export class CreateExpenseDto {
  @ApiModelProperty({ example: 'expenseName', type: 'str' })
  readonly name: string;

  @ApiModelProperty({ example: 4.12, type: 'double' })
  readonly price: number;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
  })
  @IsISO8601()
  readonly date: string;

  @ApiModelProperty({ example: 33, type: 'int' })
  readonly userId: number;
}
