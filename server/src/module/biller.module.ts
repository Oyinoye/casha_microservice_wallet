import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillerController } from '../web/rest/biller.controller';
import { BillerRepository } from '../repository/biller.repository';
import { BillerService } from '../service/biller.service';

@Module({
    imports: [TypeOrmModule.forFeature([BillerRepository])],
    controllers: [BillerController],
    providers: [BillerService],
    exports: [BillerService],
})
export class BillerModule {}
