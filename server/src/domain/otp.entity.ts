/* eslint-disable @typescript-eslint/no-unused-vars */
import { OtpStatus, OtpTypes, OtpUsage } from '../utils/enums';
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * OTP recording
 */
@Entity('otp')
export class OtpEntity extends BaseEntity {

    @Column({ name: 'otp', nullable: false })
    otp: string;

    @Column({ name: 'type', nullable: false, enum: OtpTypes})
    type: string;

    @Column({ name: 'usage', nullable: false, enum: OtpUsage })
    usage: string;

    @Column({ name: 'expirationTime', nullable: false })
    expirationTime: number;

    @Column({ name: 'status', nullable: false, enum: OtpStatus, default: OtpStatus.UNUSED })
    status: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
