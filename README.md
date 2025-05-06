# Real-Time Crypto Price Tracker

A streaming application that displays real-time Bitcoin and Ethereum prices using Kafka, FastAPI, and React.

## Features

- Real-time price updates every 10 seconds  
- WebSocket-based communication  
- Kafka message broker for reliable data streaming  
- Clean React frontend interface  
- Connection status monitoring  

## System Architecture

```
+-------------+    +------------+    +------------+    +-----------+    +----------+
| CoinGecko   |    | Kafka      |    | FastAPI    |    | React     |    | Browser  |
| API         +--> + Producer   +--> + Broker     +--> + WebSocket +--> + Client   |
| (BTC/ETH)   |    | (Python)   |    | (Docker)   |    | Server    |    | (React)  |
+-------------+    +------------+    +------------+    +-----------+    +----------+
```

## Prerequisites

- Docker and Docker Compose  
- Python 3.7+  
- Node.js 16+ and npm/yarn  

## Setup Instructions

### 1. Create and activate virtual environment

```bash
# Create virtual environment
python -m venv .venv

# Activate it (Linux/Mac)
source .venv/bin/activate

# Activate it (Windows)
source .venv/Scripts/activate

```

### 2. Install Python dependencies

Make sure your virtual environment (`.venv`) is activated before installing the dependencies.

```bash
# Activate it (Linux/Mac)
source .venv/bin/activate

# Or activate it (Windows)
source .venv/Scripts/activate

# Then install dependencies
pip install -r requirements.txt
```

**requirements.txt contents:**
```
aiokafka
aiohttp
python-socketio
fastapi
uvicorn
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the infrastructure

```bash
docker-compose up -d
```

## Running the Application

Run these commands in separate terminal windows/tabs:

### Start the WebSocket server:

```bash
python server.py
```

### Start the Kafka producer:

```bash
python producer.py
```

### Start the Kafka consumer:

```bash
python consumer.py
```

### Start the React frontend:

```bash
cd frontend
npm run dev
```

## Accessing the Application

Open your browser at:

[http://localhost:3000](http://localhost:3000)

## Project Structure

```
crypto-tracker/
├── .venv/                 # Python virtual environment
├── frontend/              # React application
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx       # React entry point
│   ├── index.html         # HTML template
├── docker-compose.yml     # Kafka and Zookeeper setup
├── producer.py            # Kafka producer
├── consumer.py            # Kafka consumer
├── server.py              # WebSocket server
├── requirements.txt       # Python dependencies
```

## Troubleshooting

### Kafka connection issues:
- Verify Docker containers are running:  
  ```bash
  docker ps
  ```
- Check Kafka logs:  
  ```bash
  docker logs kafka
  ```

### WebSocket connection problems:
- Ensure the server is running on port `4000`
- Check CORS settings in `server.py`

### Frontend not updating:
- Verify all backend services are running
- Check browser console for errors