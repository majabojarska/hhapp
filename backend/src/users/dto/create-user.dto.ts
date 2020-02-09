import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiModelProperty({ example: 'demouser' })
  readonly username: string;
  @ApiModelProperty({ example: 'topsecret' })
  password: string;
  @ApiModelProperty({ example: 'John' })
  readonly firstname: string;
  @ApiModelProperty({ example: 'Smith' })
  readonly surname: string;
  @ApiModelProperty({ format: 'Hex', example: '#BADA55' })
  readonly color: string;
  @ApiModelProperty({
    format: 'ISOString',
    example: '1973-10-05T00:00:00.000Z',
  })
  @IsISO8601()
  readonly dateOfBirth: string;
  @ApiModelProperty({ example: false, default: false, required: false })
  @IsBoolean()
  @IsOptional()
  readonly isAdmin?: boolean;
}
