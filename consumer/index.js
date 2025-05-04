const { Kafka } = require('kafkajs');
const io = require('socket.io-client');


const socket = io("http://localhost:4000");

const kafka = new Kafka({
    clientId: 'crypto-consumer',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'crypto-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'crypto-prices', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());
            console.log("Consumed:", data);

            
            socket.emit('crypto-data', data);  
        },
    });
};

run().catch(console.error);
