import { useState } from 'react';
import './App.css';
import ChatInput from './ChatInput';

function App() {
  return (
    <div className="chat-container">
      <div className="message-container">
        <h1>PythonChatBot</h1>
      <ChatInput/>
      </div>
    </div>
  );
}

export default App;
