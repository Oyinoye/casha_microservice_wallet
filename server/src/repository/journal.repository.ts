import { EntityRepository, Repository } from 'typeorm';
import { JournalEntity } from '../domain/journal.entity';

@EntityRepository(JournalEntity)
export class JournalRepository extends Repository<JournalEntity> {}
