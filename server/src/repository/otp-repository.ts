import { OtpEntity } from '../domain/otp.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OtpEntity)
export class OtpRepository extends Repository<OtpEntity> {}
