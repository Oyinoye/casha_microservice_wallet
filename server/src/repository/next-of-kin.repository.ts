import { OtpEntity } from '../domain/otp.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NextOfKinDTO } from 'src/service/dto/next-of-kin.dto';
import { NextOfKinEntity } from 'src/domain/next.of.kin.entity';

@EntityRepository(NextOfKinEntity)
export class NextOfKinRepository extends Repository<NextOfKinEntity> {}
