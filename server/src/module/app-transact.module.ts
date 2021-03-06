import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppTransactController } from '../web/rest/app-transact.controller';
import { AppTransactRepository } from '../repository/app-transact.repository';
import { AppTransactService } from '../service/app-transact.service';
import { KafkaModule } from './kafka.module';

@Module({
    imports: [TypeOrmModule.forFeature([AppTransactRepository]), KafkaModule],
    controllers: [AppTransactController],
    providers: [AppTransactService],
    exports: [AppTransactService],
})
export class AppTransactModule {}
