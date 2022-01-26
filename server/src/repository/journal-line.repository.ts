import { EntityRepository, Repository } from 'typeorm';
import { JournalLineEntity } from '../domain/journal-line.entity';

@EntityRepository(JournalLineEntity)
export class JournalLineRepository extends Repository<JournalLineEntity> {}
