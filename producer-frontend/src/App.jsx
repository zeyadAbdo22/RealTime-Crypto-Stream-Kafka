import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './styles.css';

function ProducerApp() {
  const [producerData, setProducerData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:4000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to producer server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('producer-update', (data) => {
      setProducerData(prev => [...prev.slice(-5), {
        ...data,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="producer-dashboard">
      <h1 className="producer-header">Producer Dashboard</h1>
      
      <div className={`producer-status ${isConnected ? 'connected' : 'disconnected'}`}>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <p className="producer-description">Data sent to Kafka every 10 seconds</p>
      
      <div className="producer-data-container">
        {[...producerData].reverse().map((item, idx) => (
          <div key={idx} className="producer-card">
            <div className="producer-timestamp">⏱ {item.timestamp}</div>
            <div className="producer-prices">
              <p>BTC: <span className="producer-price">${item.bitcoin?.usd.toFixed(2)}</span></p>
              <p>ETH: <span className="producer-price">${item.ethereum?.usd.toFixed(2)}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProducerApp;