import asyncio
import json
from aiokafka import AIOKafkaConsumer
import socketio

sio = socketio.AsyncClient()

async def consume():
    consumer = AIOKafkaConsumer(
        'crypto-prices',
        bootstrap_servers='localhost:9092',
        group_id='crypto-group',
        value_deserializer=lambda v: json.loads(v.decode('utf-8'))
    )
    
    await consumer.start()
    try:
        await sio.connect('http://localhost:4000')
        print("Connected to server")
        
        async for msg in consumer:
            data = msg.value
            print(f"Consumed: {data}")
            await sio.emit('crypto-data', data)
    finally:
        await consumer.stop()
        await sio.disconnect()

asyncio.run(consume())