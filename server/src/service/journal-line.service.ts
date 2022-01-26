import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { JournalLineDTO } from '../service/dto/journal-line.dto';
import { JournalLineMapper } from '../service/mapper/journal-line.mapper';
import { JournalLineRepository } from '../repository/journal-line.repository';

const relationshipNames = [];
relationshipNames.push('journal');
relationshipNames.push('wallet');
relationshipNames.push('journal');

@Injectable()
export class JournalLineService {
    logger = new Logger('JournalLineService');

    constructor(@InjectRepository(JournalLineRepository) private journalLineEntityRepository: JournalLineRepository) {}

    async findById(id: number): Promise<JournalLineDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.journalLineEntityRepository.findOne(id, options);
        return JournalLineMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<JournalLineDTO>): Promise<JournalLineDTO | undefined> {
        const result = await this.journalLineEntityRepository.findOne(options);
        return JournalLineMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<JournalLineDTO>): Promise<[JournalLineDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.journalLineEntityRepository.findAndCount(options);
        const journalLineEntityDTO: JournalLineDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(journalLineEntity =>
                journalLineEntityDTO.push(JournalLineMapper.fromEntityToDTO(journalLineEntity)),
            );
            resultList[0] = journalLineEntityDTO;
        }
        return resultList;
    }

    async save(journalLineEntityDTO: JournalLineDTO, creator?: string): Promise<JournalLineDTO | undefined> {
        const entity = JournalLineMapper.fromDTOtoEntity(journalLineEntityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.journalLineEntityRepository.save(entity);
        return JournalLineMapper.fromEntityToDTO(result);
    }

    async update(journalLineEntityDTO: JournalLineDTO, updater?: string): Promise<JournalLineDTO | undefined> {
        const entity = JournalLineMapper.fromDTOtoEntity(journalLineEntityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.journalLineEntityRepository.save(entity);
        return JournalLineMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.journalLineEntityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
