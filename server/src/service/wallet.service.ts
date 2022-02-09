import { AppTransactRepository } from './../repository/app-transact.repository';
import { TransactionType } from './../../../src/main/webapp/app/shared/model/enumerations/transaction-type.model';
import { JournalRepository } from './../repository/journal.repository';
import { JournalLineRepository } from './../repository/journal-line.repository';
import { OperationType } from './../domain/enumeration/operation-type';
import { JournalLineDTO } from './dto/journal-line.dto';
import { JournalDTO } from './dto/journal.dto';
import { SendMoneyDTO } from './dto/send-money.dto';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { WalletDTO } from '../service/dto/wallet.dto';
import { WalletMapper } from '../service/mapper/wallet.mapper';
import { WalletRepository } from '../repository/wallet.repository';
import { AppTransactDTO } from './dto/app-transact.dto';
import { getTimeBasedID } from '../utils/helper.service';

const relationshipNames = [];
relationshipNames.push('customer');

@Injectable()
export class WalletService {
    logger = new Logger('WalletService');

    constructor(@InjectRepository(WalletRepository) private walletEntityRepository: WalletRepository,
        @InjectRepository(JournalLineRepository) private journalLineEntityRepository: JournalLineRepository,
        @InjectRepository(JournalRepository) private journalEntityRepository: JournalRepository,
        @InjectRepository(AppTransactRepository) private transactEntityRepository: AppTransactRepository,
    ) {}

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

    async transfer(sendMoneyDTO: SendMoneyDTO, creator?: string): Promise<WalletDTO | undefined> {
        // const entity = WalletMapper.fromDTOtoEntity(walletEntityDTO);
        if (creator) {
            if (!sendMoneyDTO.createdBy) {
                sendMoneyDTO.createdBy = creator;
            }
            sendMoneyDTO.lastModifiedBy = creator;
        }

        let originWallet: WalletDTO;
        let destinationWallet: WalletDTO;

        const wallets = await this.walletEntityRepository.findByIds([sendMoneyDTO.originWalletID, sendMoneyDTO.destinationWalletID])

        if(!wallets){
            throw new HttpException('Wallet ID does not exist', HttpStatus.NOT_FOUND);
        }

        if(wallets.length !== 2){
            throw new HttpException('Unable to resolve destination wallet', HttpStatus.BAD_REQUEST);
        }

        if(wallets[0].id.toString() === sendMoneyDTO.originWalletID){
            originWallet = wallets[0];
            destinationWallet = wallets[1];
        }else{
            originWallet = wallets[1];
            destinationWallet = wallets[0];
        }

        if(originWallet.balance < sendMoneyDTO.amount){
            throw new HttpException('Unable to resolve destination wallet', HttpStatus.BAD_REQUEST);
        }

        let transactionWallets: WalletDTO[];

        originWallet.removeMoney(sendMoneyDTO.amount);
        destinationWallet.putMoney(sendMoneyDTO.amount);

        transactionWallets = [originWallet, destinationWallet];

        await this.walletEntityRepository.save(transactionWallets);

        const transactionJournalLines = []

        let originjournalLine = new JournalLineDTO();
        originjournalLine.amount = sendMoneyDTO.amount;
        originjournalLine.type = sendMoneyDTO.transactionType;
        originjournalLine.operation = OperationType.Debit;
        originjournalLine.narration = `outgoing_transfer_to_account: ${destinationWallet.accountNumber}`;
        originjournalLine.wallet = originWallet;
        originjournalLine.createdBy = sendMoneyDTO.createdBy;
        originjournalLine.createdDate = sendMoneyDTO.createdDate;

        transactionJournalLines.push(originjournalLine);
        await this.journalLineEntityRepository.save(originjournalLine);

        let destinationJournalLine = new JournalLineDTO();
        destinationJournalLine.amount = sendMoneyDTO.amount;
        destinationJournalLine.type = sendMoneyDTO.transactionType;
        destinationJournalLine.operation = OperationType.Credit;
        destinationJournalLine.narration = `incoming_transfer_from_account: ${originWallet.accountNumber}`;
        destinationJournalLine.wallet = destinationWallet;
        destinationJournalLine.createdBy = sendMoneyDTO.createdBy;
        destinationJournalLine.createdDate = sendMoneyDTO.createdDate;

        transactionJournalLines.push(destinationJournalLine);
        await this.journalLineEntityRepository.save(destinationJournalLine)


        let entryJournal = new JournalDTO();
        entryJournal.journalID = getTimeBasedID(); // Journal ID may need to be generated according to document specification in future
        entryJournal.dateOfEntry = new Date();
        entryJournal.description = `transfer_between_accounts: ${originWallet.accountNumber},  ${destinationWallet.accountNumber}`;
        entryJournal.createdBy = sendMoneyDTO.createdBy;
        entryJournal.createdDate = sendMoneyDTO.createdDate;
        entryJournal.journalLines = transactionJournalLines;

        await this.journalLineEntityRepository.save(entryJournal)
        
        if(!entryJournal){
            throw new HttpException('Unable to make journal entry', HttpStatus.UNAUTHORIZED);
        }

        let transaction = new AppTransactDTO();
        transaction.createdBy = sendMoneyDTO.createdBy;
        transaction.createdDate = sendMoneyDTO.createdDate;
        transaction.customer = originWallet.customer;
        transaction.description = sendMoneyDTO.narration;
        transaction.transactionDate = new Date()
        transaction.transactionRef = getTimeBasedID()
        transaction.type = TransactionType.WalletTransfer

        await this.transactEntityRepository.save(transaction)
        
        if(!transaction){
            throw new HttpException('Unable to record transation', HttpStatus.UNAUTHORIZED);
        }

        return originWallet
        // const result = await this.walletEntityRepository.save(entity);
        // return WalletMapper.fromEntityToDTO(result);
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
