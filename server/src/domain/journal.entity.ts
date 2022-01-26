/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { JournalLineEntity } from './journal-line.entity';

/**
 * Journal for Book-keeping
 */
@Entity('journal')
export class JournalEntity extends BaseEntity {
    @Column({ name: 'journal_id', nullable: true })
    journalID: string;

    @Column({ type: 'date', name: 'date_of_entry', nullable: true })
    dateOfEntry: any;

    @Column({ name: 'description', nullable: true })
    description: string;

    @OneToMany(
        type => JournalLineEntity,
        other => other.journal,
    )
    journalLines: JournalLineEntity[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
