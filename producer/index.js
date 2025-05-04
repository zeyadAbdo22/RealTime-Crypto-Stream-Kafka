const axios = require('axios');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'crypto-producer',
    brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function fetchCryptoData() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
    }
}

async function run() {
    await producer.connect();
    setInterval(async () => {
        const data = await fetchCryptoData();
        if (data) {
            await producer.send({
                topic: 'crypto-prices',
                messages: [{ value: JSON.stringify(data) }],
            });
            console.log("Produced:", data);
        }
    }, 10000);
}

run().catch(console.error);