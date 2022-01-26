/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { CustomerEntity } from './customer.entity';
import { TransactionType } from './enumeration/transaction-type';

/**
 * App Transaction
 */
@Entity('app_transact')
export class AppTransactEntity extends BaseEntity {
    @Column({ type: 'simple-enum', name: 'type', enum: TransactionType })
    type: TransactionType;

    @Column({ type: 'date', name: 'transaction_date', nullable: true })
    transactionDate: any;

    @Column({ name: 'transaction_ref', nullable: true })
    transactionRef: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @ManyToOne(type => CustomerEntity)
    customer: CustomerEntity;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
