/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { WalletDTO } from './wallet.dto';

/**
 * A BillerDTO object.
 */
export class BillerDTO extends BaseDTO {
    @ApiModelProperty({ description: 'name field', required: false })
    name: string;

    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ type: WalletDTO, description: 'wallet relationship' })
    wallet: WalletDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
