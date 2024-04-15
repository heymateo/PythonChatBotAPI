import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message: input
      });
      
      console.log('Respuesta del chatbot:', response.data.reply);
      
      // Limpiar el campo de entrada después de enviar la pregunta
      setInput('');
    } catch (error) {
      console.error('Error al enviar la pregunta:', error);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async (txt = input) => {
    if (txt.trim() === "" || loading) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8800/openai", {
        content: txt,
      });

      const botReply = response.data.choices[0].message.content;
        setMessages((prevMessages) => [
        ...prevMessages,
        { text: txt, user: true },
        { text: botReply, user: false},
      ]);

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
    return (
      <div className="chat-container">
        <div className="message-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.user ? "user-message" : "bot-message"}
            >
              {msg.text}
              
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Pregunta cualquier cosa..."
            disabled={loading}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    );
  };
}
export default ChatInput;
