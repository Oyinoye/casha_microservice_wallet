import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from '../web/rest/customer.controller';
import { CustomerRepository } from '../repository/customer.repository';
import { CustomerService } from '../service/customer.service';
import { NextOfKinRepository } from '../repository/next-of-kin.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerRepository]), TypeOrmModule.forFeature([NextOfKinRepository])],
    controllers: [CustomerController],
    providers: [CustomerService],
    exports: [CustomerService],
})
export class CustomerModule {}
