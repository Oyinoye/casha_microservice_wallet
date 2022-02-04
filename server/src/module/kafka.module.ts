import { TopicConsumerService } from './../service/topic-consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerService } from './../service/consumer.service';
import { ProducerService } from './../service/producer.service';
import { Module } from '@nestjs/common';

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

@Module({
    imports: [
        // In case we want to log Kafka errors to a database in future, hance commented forFeature below:
        // TypeOrmModule.forFeature([KafkaError]),  
        
        ],
    providers: [ProducerService, ConsumerService, TopicConsumerService, ],
    exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
 