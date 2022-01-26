/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { JournalDTO } from './journal.dto';
import { WalletDTO } from './wallet.dto';
import { TransactionType } from '../../domain/enumeration/transaction-type';
import { OperationType } from '../../domain/enumeration/operation-type';

/**
 * A JournalLineDTO object.
 */
export class JournalLineDTO extends BaseDTO {
    @ApiModelProperty({ description: 'amount field', required: false })
    amount: number;

    @ApiModelProperty({ enum: TransactionType, description: 'type enum field', required: false })
    type: TransactionType;

    @ApiModelProperty({ description: 'narration field', required: false })
    narration: string;

    @ApiModelProperty({ enum: OperationType, description: 'operation enum field', required: false })
    operation: OperationType;

    @ApiModelProperty({ type: JournalDTO, description: 'journal relationship' })
    journal: JournalDTO;

    @ApiModelProperty({ type: WalletDTO, description: 'wallet relationship' })
    wallet: WalletDTO;

    // @ApiModelProperty({ type: JournalDTO, description: 'journal relationship' })
    // journal: JournalDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
