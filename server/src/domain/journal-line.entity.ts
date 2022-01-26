/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { JournalEntity } from './journal.entity';
import { WalletEntity } from './wallet.entity';
import { TransactionType } from './enumeration/transaction-type';
import { OperationType } from './enumeration/operation-type';

/**
 * JournalLine -record of transactions
 */
@Entity('journal_line')
export class JournalLineEntity extends BaseEntity {
    @Column({ type: 'double', name: 'amount', nullable: true })
    amount: number;

    @Column({ type: 'simple-enum', name: 'type', enum: TransactionType })
    type: TransactionType;

    @Column({ name: 'narration', nullable: true })
    narration: string;

    @Column({ type: 'simple-enum', name: 'operation', enum: OperationType })
    operation: OperationType;

    @ManyToOne(type => JournalEntity)
    journal: JournalEntity;

    @ManyToOne(type => WalletEntity)
    wallet: WalletEntity;

    @ManyToOne(type => JournalEntity)
    journal: JournalEntity;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
