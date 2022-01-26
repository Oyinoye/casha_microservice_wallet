import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalController } from '../web/rest/journal.controller';
import { JournalRepository } from '../repository/journal.repository';
import { JournalService } from '../service/journal.service';

@Module({
    imports: [TypeOrmModule.forFeature([JournalRepository])],
    controllers: [JournalController],
    providers: [JournalService],
    exports: [JournalService],
})
export class JournalModule {}
