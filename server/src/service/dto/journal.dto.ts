/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { JournalLineDTO } from './journal-line.dto';

/**
 * A JournalDTO object.
 */
export class JournalDTO extends BaseDTO {
    @ApiModelProperty({ description: 'journalID field', required: false })
    journalID: string;

    @ApiModelProperty({ description: 'dateOfEntry field', required: false })
    dateOfEntry: any;

    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ type: JournalLineDTO, isArray: true, description: 'journalLines relationship' })
    journalLines: JournalLineDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
