import React, { useEffect, useState } from 'react';
import {
  db,
  addFriend,
  getFriend,
  updateFriend,
  deleteFriend,
  getFriendsOlderThan20,
  getJohnDoes,
  getJohnDoesOver20,
  performTransaction
} from './db';

const App: React.FC = () => {
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => setLogMessages((prev) => [...prev, message]);
  const clearLogs = () => {
    setLogMessages([]);
    setError(null);
  };

  useEffect(() => {
    const initDb = async () => {
      try {
        await db.open();
        addLog("Database 'MyBlogDemoDatabase' opened.");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`DB init failed: ${err.message}`);
        } else {
          setError(`DB init failed: An unknown error occurred.`);
        }
        console.error("DB init error:", err);
      }
    };
    initDb();

    return () => {
      if (db.isOpen()) db.close();
    };
  }, []);

  const runAllExamples = async () => {
    clearLogs();
    addLog("--- Running All Dexie.js Blog Examples ---");

    try {
      await db.friends.clear();
      addLog("Database cleared for fresh demo.");

      const id1 = await addFriend({ name: "John Doe", age: 30 });
      addLog(`Added John Doe with ID: ${id1}`);
      const id2 = await addFriend({ name: "Jane Smith", age: 25 });
      addLog(`Added Jane Smith with ID: ${id2}`);
      await addFriend({ name: "Peter Jones", age: 40 });
      addLog(`Added Peter Jones`);
      await addFriend({ name: "John Doe", age: 18, city: "Austin" });
      addLog(`Added John Doe (Austin)`);

      const friend1 = await getFriend(id1);
      addLog(`Read Friend (ID ${id1}): ${JSON.stringify(friend1)}`);

      const updated = await updateFriend(id1, { age: 31 });
      addLog(`Updated Friend (ID ${id1}, age 31): ${updated === 1 ? 'Success' : 'Fail'}`);

      const friendsOlderThan20 = await getFriendsOlderThan20();
      addLog(`Friends older than 20: ${JSON.stringify(friendsOlderThan20)}`);

      const johnDoes = await getJohnDoes();
      addLog(`All "John Doe"s: ${JSON.stringify(johnDoes)}`);

      const johnDoesOver20 = await getJohnDoesOver20();
      addLog(`"John Doe"s over 20: ${JSON.stringify(johnDoesOver20)}`);

      await performTransaction();
      addLog("Transaction example finished.");

      await deleteFriend(id2);
      addLog(`Deleted friend with ID ${id2}.`);

      addLog("--- All Dexie.js Blog Examples Finished ---");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`An error occurred: ${e.message}`);
      } else {
        setError(`An error occurred: An unknown error type was caught.`);
      }
      console.error("Error running examples:", e);
    }
  };

  return (
    <div style={appContainerStyle}>
      <h1 style={titleStyle}>Dexie.js Blog Examples (React)</h1>

      {error && <div style={errorBoxStyle}>{error}</div>}

      <div style={buttonContainerStyle}>
        <button onClick={runAllExamples} style={primaryButtonStyle}>
          Run All Blog Examples
        </button>
        <button onClick={clearLogs} style={secondaryButtonStyle}>
          Clear UI Log
        </button>
        <button onClick={() => db.friends.clear().then(() => addLog("Database data cleared!"))} style={dangerButtonStyle}>
          Clear DB Data
        </button>
      </div>

      <div style={logSectionStyle}>
        <h2 style={logTitleStyle}>Output Log</h2>
        <pre style={logPreStyle}>
          {logMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </pre>
      </div>

      <p style={footerStyle}>
        Check your browser's console (F12) and Application tab (IndexedDB) for more details.
      </p>
    </div>
  );
};

const appContainerStyle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '900px',
  margin: '40px auto',
  padding: '30px',
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  backgroundColor: '#f5f5f5',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '30px',
};

const errorBoxStyle: React.CSSProperties = {
  color: '#d32f2f',
  border: '1px solid #ef9a9a',
  padding: '12px',
  marginBottom: '25px',
  borderRadius: '6px',
  backgroundColor: '#ffebee',
  fontWeight: 'bold',
};

const buttonContainerStyle: React.CSSProperties = {
  marginBottom: '30px',
  padding: '20px',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  backgroundColor: '#ececec',
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
};

const baseButtonStyle: React.CSSProperties = {
  padding: '12px 25px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1em',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease, transform 0.1s ease',
};

const primaryButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: '#007bff',
  color: 'white',
  boxShadow: '0 2px 4px rgba(0,123,255,0.2)',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: '#6c757d',
  color: 'white',
  boxShadow: '0 2px 4px rgba(108,117,125,0.2)',
};

const dangerButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: '#dc3545',
  color: 'white',
  boxShadow: '0 2px 4px rgba(220,53,69,0.2)',
};

const logSectionStyle: React.CSSProperties = {
  marginTop: '30px',
  padding: '20px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
};

const logTitleStyle: React.CSSProperties = {
  color: '#555',
  marginBottom: '15px',
};

const logPreStyle: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  padding: '15px',
  borderRadius: '5px',
  maxHeight: '350px',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  border: '1px solid #d4d4d4',
  lineHeight: '1.4',
  fontSize: '0.9em',
  color: '#333',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '40px',
  fontSize: '0.9em',
  color: '#777',
};

export default App;