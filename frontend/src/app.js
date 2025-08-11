import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await fetch('/api');
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.text();
        setMessage(data);
      } catch (err) {
        console.error('Error fetching from backend:', err);
        setMessage('❌ Error connecting to backend');
      } finally {
        setLoading(false);
      }
    };

    getMessage();
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>React + Express + Postgres App</h1>
      {loading ? <p>Loading message from backend...</p> : <p>{message}</p>}
    </div>
  );
}

export default App;
