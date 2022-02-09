/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { CustomerEntity } from './customer.entity';
import { WalletType } from './enumeration/wallet-type';
import { WalletStatus } from './enumeration/wallet-status';

/**
 * Wallet
 */
@Entity('wallet')
export class WalletEntity extends BaseEntity {
    @Column({ name: 'wallet_id', nullable: true })
    walletID: string;

    @Column({ name: 'nuban', nullable: true })
    nuban: string;

    @Column({ name: 'account_number', nullable: true })
    accountNumber: string;

    @Column({ type: 'float', name: 'balance', nullable: true })
    balance: number;

    @Column({ type: 'date', name: 'expiry_date', nullable: true })
    expiryDate: any;

    @Column({ type: 'simple-enum', name: 'type', enum: WalletType })
    type: WalletType;

    @Column({ type: 'simple-enum', name: 'status', enum: WalletStatus })
    status: WalletStatus;

    @ManyToOne(type => CustomerEntity)
    customer: CustomerEntity;

    putMoney(amount: number) {
        this.balance += amount;
    }

    removeMoney(amount: number): void{
        this.balance -= amount;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
