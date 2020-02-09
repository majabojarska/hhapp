import { ApiModelProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiModelProperty()
  readonly username: string;
  @ApiModelProperty()
  readonly password: string;
}
