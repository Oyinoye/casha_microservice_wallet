import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { WalletDTO } from '../service/dto/wallet.dto';
import { WalletMapper } from '../service/mapper/wallet.mapper';
import { WalletRepository } from '../repository/wallet.repository';

const relationshipNames = [];
relationshipNames.push('customer');

@Injectable()
export class WalletService {
    logger = new Logger('WalletService');

    constructor(@InjectRepository(WalletRepository) private walletEntityRepository: WalletRepository) {}

    async findById(id: number): Promise<WalletDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.walletEntityRepository.findOne(id, options);
        return WalletMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<WalletDTO>): Promise<WalletDTO | undefined> {
        const result = await this.walletEntityRepository.findOne(options);
        return WalletMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<WalletDTO>): Promise<[WalletDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.walletEntityRepository.findAndCount(options);
        const walletEntityDTO: WalletDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(walletEntity => walletEntityDTO.push(WalletMapper.fromEntityToDTO(walletEntity)));
            resultList[0] = walletEntityDTO;
        }
        return resultList;
    }

    async save(walletEntityDTO: WalletDTO, creator?: string): Promise<WalletDTO | undefined> {
        const entity = WalletMapper.fromDTOtoEntity(walletEntityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.walletEntityRepository.save(entity);
        return WalletMapper.fromEntityToDTO(result);
    }

    async update(walletEntityDTO: WalletDTO, updater?: string): Promise<WalletDTO | undefined> {
        const entity = WalletMapper.fromDTOtoEntity(walletEntityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.walletEntityRepository.save(entity);
        return WalletMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.walletEntityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
