import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CustomerDTO } from '../service/dto/customer.dto';
import { CustomerMapper } from '../service/mapper/customer.mapper';
import { CustomerRepository } from '../repository/customer.repository';

const relationshipNames = [];

@Injectable()
export class CustomerService {
    logger = new Logger('CustomerService');

    constructor(@InjectRepository(CustomerRepository) private customerEntityRepository: CustomerRepository) {}

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
}
