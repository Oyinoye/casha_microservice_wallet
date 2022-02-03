import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { Repository, getRepository } from 'typeorm';
import { ConsumerService } from './consumer.service';

import { Injectable, OnModuleInit, forwardRef, Inject } from '@nestjs/common';

// Example of consummer service to consume a particular topic and perform logic.

@Injectable()
export class TopicConsumerService implements OnModuleInit {
    constructor( 
        private consumerService: ConsumerService,
    ) {}


    async onModuleInit() {
        await this.consumerService.consume({ topic: 'ChampionStateChanged' }, {
            eachMessage: async ({ topic, partition, message}) => {
                console.log({
                    value: message.value.toString(),
                    topic: topic.toString(),
                    partition: partition.toString(),
                });
            }
        });

        
    }
  
}

// export class KafkaService {
//     constructor(
    //   @InjectRepository(KafkaEntity) private readonly kafkaRepository: Repository<KafkaEntity>,
//       @Inject("KAFKA_SERVICE") private client: ClientKafka
//     ) {
//     }

//     async emit(topic: string[], key: string, value: any) {
//       for (let i = 0; i < topic.length; i++) {
//         await this.client.emit(topic, {
//           key,
//           value: JSON.stringify(value)
//         });
//       }
//     }
  
//     async save(data: any) {
//       return this.kafkaRepository.save(data);
//     }
//   }

