import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiModelProperty({ example: 'Obuwie', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty({ format: 'Hex', example: '#BADA55', required: false })
  @IsOptional()
  readonly color?: string;

  @IsBoolean()
  @IsOptional()
  @ApiModelProperty({ example: false, default: false, required: false })
  readonly isShared?: boolean;
}
