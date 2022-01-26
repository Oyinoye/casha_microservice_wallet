import { EntityRepository, Repository } from 'typeorm';
import { BillerEntity } from '../domain/biller.entity';

@EntityRepository(BillerEntity)
export class BillerRepository extends Repository<BillerEntity> {}
