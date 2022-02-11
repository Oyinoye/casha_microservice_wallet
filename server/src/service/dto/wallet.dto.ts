/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { CustomerDTO } from './customer.dto';
import { WalletType } from '../../domain/enumeration/wallet-type';
import { WalletStatus } from '../../domain/enumeration/wallet-status';

/**
 * A WalletDTO object.
 */
export class WalletDTO extends BaseDTO {
    @ApiModelProperty({ description: 'walletID field', required: false })
    walletID: string;

    @ApiModelProperty({ description: 'nuban field', required: false })
    nuban?: string;

    @ApiModelProperty({ description: 'accountNumber field', required: false })
    accountNumber?: string;

    @ApiModelProperty({ description: 'balance field', required: false })
    balance?: number;

    @ApiModelProperty({ description: 'expiryDate field', required: false })
    expiryDate?: any;

    @ApiModelProperty({ enum: WalletType, description: 'type enum field', required: false })
    type: WalletType;

    @ApiModelProperty({ enum: WalletStatus, description: 'status enum field', required: false })
    status: WalletStatus;

    @ApiModelProperty({ type: CustomerDTO, description: 'customer relationship' })
    customer?: CustomerDTO;         //temporarily made this optional because of system wallet

    putMoney(amount: number) {
        this.balance += amount;
    }

    removeMoney(amount: number): void{
        this.balance -= amount;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
