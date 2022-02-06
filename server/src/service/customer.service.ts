import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CustomerDTO } from '../service/dto/customer.dto';
import { CustomerMapper } from '../service/mapper/customer.mapper';
import { CustomerRepository } from '../repository/customer.repository';
import { BvnDTO } from './dto/bvn.dto';
import { NextOfKinRepository } from 'src/repository/next-of-kin.repository';
import { NextOfKinDTO } from './dto/next-of-kin.dto';

const relationshipNames = [];

@Injectable()
export class CustomerService {
    logger = new Logger('CustomerService');

    constructor(
        @InjectRepository(CustomerRepository) private customerEntityRepository: CustomerRepository,
        @InjectRepository(NextOfKinRepository) private nextOfKinRepository: NextOfKinRepository
    ) {}

    async findById(id: number): Promise<CustomerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.customerEntityRepository.findOne(id, options);
        return CustomerMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<CustomerDTO>): Promise<CustomerDTO | undefined> {
        const result = await this.customerEntityRepository.findOne(options);
        return CustomerMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<CustomerDTO>): Promise<[CustomerDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.customerEntityRepository.findAndCount(options);
        const customerEntityDTO: CustomerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(customerEntity =>
                customerEntityDTO.push(CustomerMapper.fromEntityToDTO(customerEntity)),
            );
            resultList[0] = customerEntityDTO;
        }
        return resultList;
    }

    async save(customerEntityDTO: CustomerDTO, creator?: string): Promise<CustomerDTO | undefined> {
        const entity = CustomerMapper.fromDTOtoEntity(customerEntityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.customerEntityRepository.save(entity);
        return CustomerMapper.fromEntityToDTO(result);
    }

    async update(customerEntityDTO: CustomerDTO, updater?: string): Promise<CustomerDTO | undefined> {
        const entity = CustomerMapper.fromDTOtoEntity(customerEntityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.customerEntityRepository.save(entity);
        return CustomerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.customerEntityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async addBvn(payload:BvnDTO, customerID): Promise<any> {

        // check that customer exists and is active
        const customer: CustomerDTO = await this.findById(customerID);
        if(!customer && customer.status && customer.status === 'Active')
            throw new HttpException('Error, customer not found', HttpStatus.NOT_FOUND);
        
        // check if customer already has a BVN
        if(customer.bvn && customer.bvn !== null)
            throw new HttpException('Error, customer BVN already set', HttpStatus.NOT_FOUND);

        // To-Do: vefify BVN

        // If BVN id verified, add the BVN to customer's recored
        customer.bvn = payload.bvn;
        const updateResult = await this.update(customer, customer.user.login);
        if(!updateResult)
            throw new HttpException('Error, unable to add BVN', HttpStatus.NOT_FOUND);

        return updateResult;
    }

    async addNextOfKin(payload, customerID): Promise<any> {

        // check that customer exists and is active
        const customer: CustomerDTO = await this.findById(customerID);
        if(!customer && customer.status && customer.status === 'Active')
            throw new HttpException('Error, customer not found', HttpStatus.NOT_FOUND);
        
        // check if customer already added a Next of Kin
        const existingKin = await this.nextOfKinRepository.find({where: {"customer.customerID": customer.customerID}});
        if(existingKin)
            throw new HttpException('Error, next of kin already added', HttpStatus.NOT_FOUND);

        // save next of kin info, if not exists
        const newKin = await this.nextOfKinRepository.save(existingKin);
        if(!newKin)
            throw new HttpException('Error, cannot add next of kin', HttpStatus.NOT_FOUND);

        return newKin;
    }
}
