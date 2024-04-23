import React, { useState, useEffect, useRef } from "react";
import "./ChatInput.css";
import axios from "axios";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [generatedText, setGeneratedText] = useState(""); // Estado para el texto generado
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || loading) return;

    setLoading(true);
    setGeneratingResponse(true);

    // Mostrar la pregunta mientras se genera la respuesta
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, user: true },
    ]);

    try {
      const response = await axios.post("http://localhost:8800/openai", {
        content: input,
      });

      const botReply = response.data.choices[0].message.content;

      // Simular la generación gradual del texto
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex <= botReply.length) {
          setGeneratedText(botReply.substring(0, currentIndex));
          currentIndex += 3; // Ajusta el incremento para acelerar la generación
        } else {
          clearInterval(timer);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: botReply, user: false },
          ]);
          setInput("");
          setLoading(false);
          setGeneratingResponse(false);
        }
      }, 50); // Velocidad de generación ajustable

    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
      setGeneratingResponse(false);
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
        {generatingResponse && (
          <div className="bot-message">{generatedText}</div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Pregúntame"
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
