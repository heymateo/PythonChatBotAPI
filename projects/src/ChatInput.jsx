import React, { useState, useEffect, useRef } from "react";
import "./ChatInput.css";
import axios from "axios";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [aiResponse, setAiResponse] = useState(""); // Nuevo estado para la respuesta del AI
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Desplazar hacia abajo cada vez que cambian los mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    try {
      // Hacer una llamada a tu servidor backend en lugar de al API directamente
      const response = await axios.post("http://localhost:8800/openai", {
        content: input,
      });

      // Obtener la respuesta del servidor backend
      const botReply = response.data.choices[0].message.content;

      // Actualizar los mensajes con la respuesta del AI
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, user: true },
        { text: botReply, user: false },
      ]);

      // Guardar la respuesta del AI en el estado
      setAiResponse(botReply);

      // Clear the input field
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

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
        <div ref={messagesEndRef}></div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Preguntame..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
