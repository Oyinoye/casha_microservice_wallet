/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { CustomerEntity } from './customer.entity';

/**
 * Customer
 */
@Entity('next_of_kin')
export class NextOfKinEntity extends BaseEntity {
    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ name: 'email', nullable: true })
    email?: string;

    @Column({ name: 'address' })
    phoneNumber: string;

    @Column({ name: 'nationality' })
    nationality: string

    @Column({ name: 'address' })
    address: string;

    @Column({ type: 'date', name: 'date_of_birth', nullable: true })
    relationship: any;

    @OneToOne(type => CustomerEntity)
    @JoinColumn()
    customer: CustomerEntity;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
