import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './styles.css';

function ConsumerApp() {
  const [consumerData, setConsumerData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:4001', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to consumer server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('consumer-update', (data) => {
      setConsumerData(prev => [...prev.slice(-5), {
        ...data,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="consumer-dashboard">
      <h1 className="consumer-header">Consumer Dashboard</h1>
      
      <div className={`consumer-status ${isConnected ? 'connected' : 'disconnected'}`}>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <p className="consumer-description">Data received from Kafka in real-time</p>
      
      <div className="consumer-data-container">
        {[...consumerData].reverse().map((item, idx) => (
          <div key={idx} className="consumer-card">
            <div className="consumer-timestamp">⏱ {item.timestamp}</div>
            <div className="consumer-prices">
              <p>BTC: <span className="consumer-price">${item.bitcoin?.usd.toFixed(2)}</span></p>
              <p>ETH: <span className="consumer-price">${item.ethereum?.usd.toFixed(2)}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConsumerApp;