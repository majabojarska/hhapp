import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class UpdateExpenseDto {
  @ApiModelProperty({ example: 'expenseName', type: 'str', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty({ example: 4.12, type: 'double', required: false })
  @IsOptional()
  readonly price?: number;

  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  readonly date?: string;

  @ApiModelProperty({ example: 33, type: 'int', required: false })
  @IsOptional()
  readonly userId?: number;
}
