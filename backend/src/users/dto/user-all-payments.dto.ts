import { UserSinglePaymentDto } from './user-single-payment.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserAllPaymentsDto {
  @ApiModelProperty({
    example: '[UserSinglePaymentDto]',
    description: 'Array of single user payment data transfer objects',
  })
  readonly payments: UserSinglePaymentDto[] = [];
}
