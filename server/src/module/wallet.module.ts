import { JournalRepository } from './../repository/journal.repository';
import { JournalLineRepository } from './../repository/journal-line.repository';
import { AppTransactRepository } from './../repository/app-transact.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from '../web/rest/wallet.controller';
import { WalletRepository } from '../repository/wallet.repository';
import { WalletService } from '../service/wallet.service';

@Module({
    imports: [TypeOrmModule.forFeature([WalletRepository, JournalLineRepository, JournalRepository, AppTransactRepository])],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
