# RealTime-Crypto-Stream-Kafka

## Instructions

### 1. Start Kafka
```bash
docker-compose up -d
```

### 2. Start the Producer
```bash
cd producer
npm install axios kafkajs
node index.js
```

### 3. Start the Server
```bash
cd server
npm install express socket.io cors
node index.js
```

### 4. Start the Consumer
```bash
cd consumer
npm install kafkajs socket.io-client
node index.js
```

### 5. Start the Client UI
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to view real-time updates.