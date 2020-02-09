import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiModelProperty({ example: 'Obuwie' })
  readonly name: string;

  @ApiModelProperty({ format: 'Hex', example: '#BADA55' })
  readonly color: string;

  @IsBoolean()
  @IsOptional()
  @ApiModelProperty({ example: false, default: false, required: false })
  readonly isShared: boolean;
}
