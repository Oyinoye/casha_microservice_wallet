import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalLineController } from '../web/rest/journal-line.controller';
import { JournalLineRepository } from '../repository/journal-line.repository';
import { JournalLineService } from '../service/journal-line.service';

@Module({
    imports: [TypeOrmModule.forFeature([JournalLineRepository])],
    controllers: [JournalLineController],
    providers: [JournalLineService],
    exports: [JournalLineService],
})
export class JournalLineModule {}
