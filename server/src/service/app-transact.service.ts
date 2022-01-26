import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AppTransactDTO } from '../service/dto/app-transact.dto';
import { AppTransactMapper } from '../service/mapper/app-transact.mapper';
import { AppTransactRepository } from '../repository/app-transact.repository';

const relationshipNames = [];
relationshipNames.push('customer');

@Injectable()
export class AppTransactService {
    logger = new Logger('AppTransactService');

    constructor(@InjectRepository(AppTransactRepository) private appTransactEntityRepository: AppTransactRepository) {}

    async findById(id: number): Promise<AppTransactDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.appTransactEntityRepository.findOne(id, options);
        return AppTransactMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AppTransactDTO>): Promise<AppTransactDTO | undefined> {
        const result = await this.appTransactEntityRepository.findOne(options);
        return AppTransactMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AppTransactDTO>): Promise<[AppTransactDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.appTransactEntityRepository.findAndCount(options);
        const appTransactEntityDTO: AppTransactDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(appTransactEntity =>
                appTransactEntityDTO.push(AppTransactMapper.fromEntityToDTO(appTransactEntity)),
            );
            resultList[0] = appTransactEntityDTO;
        }
        return resultList;
    }

    async save(appTransactEntityDTO: AppTransactDTO, creator?: string): Promise<AppTransactDTO | undefined> {
        const entity = AppTransactMapper.fromDTOtoEntity(appTransactEntityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.appTransactEntityRepository.save(entity);
        return AppTransactMapper.fromEntityToDTO(result);
    }

    async update(appTransactEntityDTO: AppTransactDTO, updater?: string): Promise<AppTransactDTO | undefined> {
        const entity = AppTransactMapper.fromDTOtoEntity(appTransactEntityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.appTransactEntityRepository.save(entity);
        return AppTransactMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.appTransactEntityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
