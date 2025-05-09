
# Real-Time Crypto Dashboard with Kafka

This project demonstrates a real-time cryptocurrency price tracking system with separate producer and consumer interfaces.

---

## Features

- **Dual Dashboard System**  
  -  *Producer Dashboard*: Displays data sent to Kafka  
  -  *Consumer Dashboard*: Displays data received from Kafka
-  WebSocket-based real-time updates  
-  Kafka message broker for reliable data streaming  
-  Isolated frontend interfaces for each component  

---

##  System Architecture

```
+-------------+     +------------+     +------------+     +-----------------+
|  CoinGecko  +-->  |  Producer  +-->  |   Kafka    +-->  |    Consumer     |
|   API       |     |  Server    |     |  Broker    |     |     Server      |
| (BTC/ETH)   |     |  (Port 4000)    | (Docker)   |     |   (Port 4001)   |
+-------------+     +------------+     +------------+     +--------+--------+
                                                                     ↓
          +-------------------+     +-------------------+     +-------------------+
          | Producer Frontend |     | Consumer Frontend |     | Docker Containers |
          |  (React - 3000)   |     |  (React - 3001)   |     | Zookeeper/Kafka   |
          +-------------------+     +-------------------+     +-------------------+
```

---

## 🔧 Prerequisites

- [Docker & Docker Compose](https://www.docker.com/)  
- Python 3.8+  
- Node.js 16+ & npm  

---

##  Setup Instructions

### 1. Start Kafka Infrastructure
```bash
docker-compose up -d
```
### 1. virtual environment and Install Python Dependencies

```bash
# Create virtual environment
python -m venv .venv

# Activate it (Linux/Mac)
source .venv/bin/activate

# Activate it (Windows)
source .venv/Scripts/activate

# For install Library
pip install -r requirements.txt

**`requirements.txt`:**
```
fastapi>=0.68.0
uvicorn>=0.15.0
python-socketio>=5.0.0
aiokafka>=0.7.0
aiohttp>=3.7.0
```

```
### 3. Run Backend Services (in separate terminals)
```bash
# Producer Server (Port 4000)
python producer-server.py

# Consumer Server (Port 4001)
python consumer-server.py
```

### 4. Setup Frontends

#### Producer Frontend
```bash
cd producer-frontend
npm install
npm run dev  # Runs on port 3000
```

#### Consumer Frontend
```bash
cd consumer-frontend
npm install
npm run dev  # Runs on port 3001
```
---

##  Access the Dashboards

- **Producer Dashboard**: [http://localhost:3000](http://localhost:3000)  
- **Consumer Dashboard**: [http://localhost:3001](http://localhost:3001)

---

##  Project Structure

```
crypto-kafka-dashboard/
├── producer-frontend/       # React app for producer
│   └── src/
│       ├── App.jsx          # Producer UI component
│       └── main.jsx         # Producer entry point
├── consumer-frontend/       # React app for consumer
│   └── src/
│       ├── App.jsx          # Consumer UI component
│       └── main.jsx         # Consumer entry point
├── backend/
│   ├── producer-server.py   # Producer WebSocket server
│   └── consumer-server.py   # Consumer WebSocket server
└── docker-compose.yml       # Kafka and Zookeeper setup
```

---

##  Key Differences from Original

- **Separate Frontends**:  
  Isolated React apps for producer and consumer on ports `3000` and `3001`

- **Dedicated Servers**:  
  Producer server (`4000`) sends data, consumer server (`4001`) receives

- **Clear Data Flow**:  
  - *Producer Path*: API → Kafka → Producer UI  
  - *Consumer Path*: Kafka → Consumer UI

---

##  Troubleshooting

### Kafka Connection Problems
```bash
# Check if Kafka is running
docker ps -a

# View Kafka logs
docker logs kafka
```

### WebSocket Errors

- Ensure both servers are running (ports `4000` & `4001`)
- Check for CORS configuration in backend servers

### Frontend Not Updating

- Verify frontend is using the correct ports
- Open browser console for any WebSocket or CORS errors
