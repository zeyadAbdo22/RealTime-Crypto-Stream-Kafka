from fastapi import FastAPI
import uvicorn
from socketio import AsyncServer
import socketio.asgi
from aiokafka import AIOKafkaConsumer
import asyncio
import json

app = FastAPI()
sio = AsyncServer(async_mode='asgi', cors_allowed_origins='*')
sio_app = socketio.asgi.ASGIApp(sio, app)

async def consume_from_kafka():
    consumer = AIOKafkaConsumer(
        'crypto-prices',
        bootstrap_servers='localhost:9092',
        group_id='crypto-group',
        auto_offset_reset='earliest',
        value_deserializer=lambda v: json.loads(v.decode('utf-8'))
    )
    await consumer.start()
    
    try:
        async for msg in consumer:
            await sio.emit('consumer-update', msg.value)
            print(f"Consumed: {msg.value}")
    finally:
        await consumer.stop()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(consume_from_kafka())

if __name__ == "__main__":
    uvicorn.run(sio_app, host="0.0.0.0", port=4001)