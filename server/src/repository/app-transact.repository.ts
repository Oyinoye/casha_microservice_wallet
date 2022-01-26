import { EntityRepository, Repository } from 'typeorm';
import { AppTransactEntity } from '../domain/app-transact.entity';

@EntityRepository(AppTransactEntity)
export class AppTransactRepository extends Repository<AppTransactEntity> {}
