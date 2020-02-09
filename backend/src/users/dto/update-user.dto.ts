import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsBooleanString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @ApiModelProperty({ example: 'topsecret', required: false })
  @IsOptional()
  password?: string;
  @ApiModelProperty({ example: 'John', required: false })
  @IsOptional()
  readonly firstname?: string;
  @ApiModelProperty({ example: 'Smith', required: false })
  @IsOptional()
  readonly surname?: string;
  @ApiModelProperty({ format: 'Hex', example: '#BADA55', required: false })
  @IsOptional()
  readonly color?: string;
  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  readonly dateOfBirth?: string;
  @ApiModelProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;
}
