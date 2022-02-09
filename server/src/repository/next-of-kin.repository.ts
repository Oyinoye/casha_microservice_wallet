import { EntityRepository, Repository } from 'typeorm';
import { NextOfKinEntity } from '../domain/next.of.kin.entity';

@EntityRepository(NextOfKinEntity)
export class NextOfKinRepository extends Repository<NextOfKinEntity> {}
