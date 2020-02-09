import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserSinglePaymentDto {
  constructor(user: User, paymentTotal: number) {
    this.user = user;
    this.paymentTotal = paymentTotal;
  }
  @ApiModelProperty({ example: 'User' })
  readonly user: User;
  @ApiModelProperty({ example: 22.22 })
  paymentTotal: number;
}
