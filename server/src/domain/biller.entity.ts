/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { WalletEntity } from './wallet.entity';

/**
 * App Transaction
 */
@Entity('biller')
export class BillerEntity extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @OneToOne(type => WalletEntity)
    @JoinColumn()
    wallet: WalletEntity;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
