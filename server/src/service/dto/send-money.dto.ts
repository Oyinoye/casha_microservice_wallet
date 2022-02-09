import { TransactionType } from './../../domain/enumeration/transaction-type';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


/**
 * A DTO for sending money within the wallet system.
 */
export class SendMoneyDTO extends BaseDTO {
    @ApiModelProperty({ description: 'amount of money to be sent', required: true })
    amount: number;

    @ApiModelProperty({ description: 'wallet ID of the wallet money is to be sent from', required: true })
    originWalletID: string;

    @ApiModelProperty({ description: 'wallet ID of the wallet money is to be sent to', required: true })
    destinationWalletID: string;

    @ApiModelProperty({ description: 'accompanying narration', required: true })
    transactionType: TransactionType;
    
    @ApiModelProperty({ description: 'accompanying narration', required: false })
    narration: string;


}
