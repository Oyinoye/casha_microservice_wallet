import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { JournalDTO } from '../service/dto/journal.dto';
import { JournalMapper } from '../service/mapper/journal.mapper';
import { JournalRepository } from '../repository/journal.repository';

const relationshipNames = [];

@Injectable()
export class JournalService {
    logger = new Logger('JournalService');

    constructor(@InjectRepository(JournalRepository) private journalEntityRepository: JournalRepository) {}

    async findById(id: number): Promise<JournalDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.journalEntityRepository.findOne(id, options);
        return JournalMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<JournalDTO>): Promise<JournalDTO | undefined> {
        const result = await this.journalEntityRepository.findOne(options);
        return JournalMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<JournalDTO>): Promise<[JournalDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.journalEntityRepository.findAndCount(options);
        const journalEntityDTO: JournalDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(journalEntity => journalEntityDTO.push(JournalMapper.fromEntityToDTO(journalEntity)));
            resultList[0] = journalEntityDTO;
        }
        return resultList;
    }

    async save(journalEntityDTO: JournalDTO, creator?: string): Promise<JournalDTO | undefined> {
        const entity = JournalMapper.fromDTOtoEntity(journalEntityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.journalEntityRepository.save(entity);
        return JournalMapper.fromEntityToDTO(result);
    }

    async update(journalEntityDTO: JournalDTO, updater?: string): Promise<JournalDTO | undefined> {
        const entity = JournalMapper.fromDTOtoEntity(journalEntityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.journalEntityRepository.save(entity);
        return JournalMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.journalEntityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
