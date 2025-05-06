from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from socketio import AsyncServer

app = FastAPI()
sio = AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Server started on port 4000")

@sio.on('connect')
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.on('crypto-data')
async def crypto_data(sid, data):
    print(f"Received from consumer: {data}")
    await sio.emit('crypto-data', data)

if __name__ == "__main__":
    import socketio.asgi
    sio_app = socketio.asgi.ASGIApp(sio, app)
    uvicorn.run(sio_app, host="0.0.0.0", port=4000)