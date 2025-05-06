import asyncio
import json
import aiohttp
from aiokafka import AIOKafkaProducer

async def fetch_crypto_data():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

async def produce():
    producer = AIOKafkaProducer(
        bootstrap_servers='localhost:9092',
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    await producer.start()
    try:
        while True:
            data = await fetch_crypto_data()
            if data:
                await producer.send('crypto-prices', data)
                print(f"Produced: {data}")
            await asyncio.sleep(10)
    finally:
        await producer.stop()

asyncio.run(produce())