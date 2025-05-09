from fastapi import FastAPI
import uvicorn
from socketio import AsyncServer
import socketio.asgi
import asyncio
import aiohttp
from aiokafka import AIOKafkaProducer
import json

app = FastAPI()
sio = AsyncServer(async_mode='asgi', cors_allowed_origins='*')
sio_app = socketio.asgi.ASGIApp(sio, app)

async def fetch_crypto_data():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

async def produce_to_kafka():
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
                await sio.emit('producer-update', data)
                print(f"Produced: {data}")
            await asyncio.sleep(10)
    finally:
        await producer.stop()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(produce_to_kafka())

if __name__ == "__main__":
    uvicorn.run(sio_app, host="0.0.0.0", port=4000)