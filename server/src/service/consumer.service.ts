
import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Kafka, Consumer, ConsumerRunConfig, ConsumerSubscribeTopic } from "kafkajs";

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    constructor() {}

    private readonly kafka = new Kafka({
        clientId: 'casha_wallet',
        brokers: [process.env.KAFKA_BOOTSTRAP_SERVER], 
        ssl,
        sasl: {
            mechanism: 'plain',
            username,
            password
        }
    });
    private readonly consumers: Consumer[] = [];
 
    async consume(topic: ConsumerSubscribeTopic, config: ConsumerRunConfig) {
        const consumer = this.kafka.consumer({ groupId: 'casha_microservice'});
        await consumer.connect();
        await consumer.subscribe(topic);
        await consumer.run(config);
        this.consumers.push(consumer)
    }

    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
}[]