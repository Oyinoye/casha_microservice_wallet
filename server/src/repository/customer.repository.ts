import { EntityRepository, Repository } from 'typeorm';
import { CustomerEntity } from '../domain/customer.entity';

@EntityRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {}
