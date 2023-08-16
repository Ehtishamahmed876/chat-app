// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [userJoined, setUserJoined] = useState(false);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off('message');
    };
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
  if (username.trim() !== '') {
      setUsername(username.trim());
      setUserJoined(true);
      socket.emit('user-join', { username });
    }
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      socket.emit('message', { text: messageInput, username });
      setMessageInput('');
    }
  };

  return (
    <div className="App">
      {!userJoined ? (
        <div className="username-prompt">
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
      ) : (
        <div className="chat-container">
          <div className="message-list">
            {messages.map((message, index) => (
              <div key={index} className="message">
                {message.username}: {message.text}
              </div>
            ))}
          </div>
          <form className="message-form" onSubmit={handleMessageSubmit}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Enter your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
