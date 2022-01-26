/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { UserDTO } from './user.dto';

/**
 * A CustomerDTO object.
 */
export class CustomerDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'customerID field' })
    customerID: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'phoneNumber field' })
    phoneNumber: string;

    @ApiModelProperty({ description: 'nationality field', required: false })
    nationality: string;

    @ApiModelProperty({ description: 'address field', required: false })
    address: string;

    @ApiModelProperty({ description: 'bvn field', required: false })
    bvn: number;

    @ApiModelProperty({ description: 'dateOfBirth field', required: false })
    dateOfBirth: any;

    @ApiModelProperty({ type: UserDTO, description: 'user relationship' })
    user: UserDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
