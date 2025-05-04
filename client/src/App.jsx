import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [logs, setLogs] = useState([]); // بدل ما نعرض واحدة فقط

  useEffect(() => {
    socket.on('crypto-data', (data) => {
      console.log("Received in frontend:", data);
      // نضيف البيانات الجديدة في اللوج
      setLogs(prev => [...prev, { ...data, timestamp: Date.now() }]);
    });

    return () => {
      socket.off('crypto-data');
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1> Real-Time Crypto Prices</h1>
      <p>Streaming updates every 10 seconds...</p>
      <ul>
        {logs.slice(-10).reverse().map((entry, idx) => (
          <li key={idx}>
            <strong>{new Date(entry.timestamp).toLocaleTimeString()}</strong> – BTC: ${entry.bitcoin?.usd} | ETH: ${entry.ethereum?.usd}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
