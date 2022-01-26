/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { CustomerDTO } from './customer.dto';
import { TransactionType } from '../../domain/enumeration/transaction-type';

/**
 * A AppTransactDTO object.
 */
export class AppTransactDTO extends BaseDTO {
    @ApiModelProperty({ enum: TransactionType, description: 'type enum field', required: false })
    type: TransactionType;

    @ApiModelProperty({ description: 'transactionDate field', required: false })
    transactionDate: any;

    @ApiModelProperty({ description: 'transactionRef field', required: false })
    transactionRef: string;

    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ type: CustomerDTO, description: 'customer relationship' })
    customer: CustomerDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
