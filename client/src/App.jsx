import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

function App() {
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // إنشاء اتصال Socket مرة واحدة باستخدام useCallback
  const socket = useCallback(() => io('http://localhost:4000', {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }), []);

  useEffect(() => {
    const socketInstance = socket();

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Connected to server');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleCryptoData = (data) => {
      setLogs(prev => {
        const newLog = { 
          ...data, 
          timestamp: new Date().toISOString() 
        };
        // حفظ آخر 10 تحديثات فقط لتحسين الأداء
        return [...prev.slice(-9), newLog];
      });
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('crypto-data', handleCryptoData);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('crypto-data', handleCryptoData);
      socketInstance.disconnect();
    };
  }, [socket]);

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>Real-Time Crypto Prices</h1>
      
      <div style={{ 
        margin: '1rem 0',
        padding: '0.5rem',
        backgroundColor: isConnected ? '#e6f7ee' : '#ffebee',
        borderRadius: '4px',
        borderLeft: `4px solid ${isConnected ? '#4caf50' : '#f44336'}`
      }}>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      <p>Streaming updates every 10 seconds...</p>
      
      <ul style={{ 
        listStyle: 'none',
        padding: 0,
        border: '1px solid #eee',
        borderRadius: '8px'
      }}>
        {[...logs].reverse().map((entry, idx) => (
          <li key={idx} style={{ 
            padding: '1rem',
            borderBottom: '1px solid #eee',
            backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white'
          }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
              {new Date(entry.timestamp).toLocaleTimeString()}
            </strong>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span>BTC: <strong>${entry.bitcoin?.usd.toFixed(2)}</strong></span>
              <span>ETH: <strong>${entry.ethereum?.usd.toFixed(2)}</strong></span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;