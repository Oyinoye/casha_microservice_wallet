import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BillerDTO } from '../service/dto/biller.dto';
import { BillerMapper } from '../service/mapper/biller.mapper';
import { BillerRepository } from '../repository/biller.repository';

const relationshipNames = [];

@Injectable()
export class BillerService {
    logger = new Logger('BillerService');

    constructor(@InjectRepository(BillerRepository) private billerEntityRepository: BillerRepository) {}

    async findById(id: number): Promise<BillerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.billerEntityRepository.findOne(id, options);
        return BillerMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<BillerDTO>): Promise<BillerDTO | undefined> {
        const result = await this.billerEntityRepository.findOne(options);
        return BillerMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<BillerDTO>): Promise<[BillerDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.billerEntityRepository.findAndCount(options);
        const billerEntityDTO: BillerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(billerEntity => billerEntityDTO.push(BillerMapper.fromEntityToDTO(billerEntity)));
            resultList[0] = billerEntityDTO;
        }
        return resultList;
    }

    async save(billerEntityDTO: BillerDTO, creator?: string): Promise<BillerDTO | undefined> {
        const entity = BillerMapper.fromDTOtoEntity(billerEntityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.billerEntityRepository.save(entity);
        return BillerMapper.fromEntityToDTO(result);
    }

    async update(billerEntityDTO: BillerDTO, updater?: string): Promise<BillerDTO | undefined> {
        const entity = BillerMapper.fromDTOtoEntity(billerEntityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.billerEntityRepository.save(entity);
        return BillerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.billerEntityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
