/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomerStatus } from '../utils/enums';
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { UserEntity } from './user.entity';

/**
 * Customer
 */
@Entity('customer')
export class CustomerEntity extends BaseEntity {
    @Column({ name: 'customer_id', nullable: true  })
    customerID: string;

    @Column({ name: 'phone_number' })
    phoneNumber: string;

    @Column({ name: 'nationality', nullable: true })
    nationality?: string;

    @Column({ name: 'address', nullable: true })
    address?: string;

    @Column({ name: 'kyc_level', nullable: true })
    kycLevel?: number

    @Column({ name: 'bvn', nullable: true })
    bvn?: number;

    @Column({ type: 'date', name: 'date_of_birth', nullable: true })
    dateOfBirth?: any;

    @Column({ name: 'status', enum: CustomerStatus, default: CustomerStatus.ACTIVE })
    status?: string;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
