import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer, ProducerRecord } from "kafkajs"

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

@Injectable()
export class ProducerService implements OnModuleInit {
    private readonly kafka = new Kafka({
        clientId: 'event-command-kafka',
        brokers: [process.env.KAFKA_BOOTSTRAP_SERVER], // change this to brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],     ssl, sasl
        ssl,
        sasl: {
            mechanism: 'plain',
            username,
            password
        }
    })
    private readonly producer: Producer = this.kafka.producer();


    async onModuleInit() {
        await this.producer.connect();
    }

    async produce(record:ProducerRecord) {
        await this.producer.send(record);
    }

    async onApplicationShutdown() {
        await this.producer.disconnect();
    }
}

