
import axios from 'axios'; // Use Axios or fetch for HTTP requests
import React, { useEffect, useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Optionally, add initial welcome message or setup logic here
    addBotMessage('Welcome! How can I assist you today?');
  }, []);

  const addBotMessage = async (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, isBot: true }]);
  };

  const addUserMessage = async (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, isBot: false }]);
  };

  const handleUserMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to chat
    addUserMessage(input);

    try {
      const { data } = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        sender: 'user',
        message: input,
      });

      if (data && data.length > 0) {
        data.forEach((response) => {
          if (response.text) {
            addBotMessage(response.text);
          }
          // Handle other types of responses (images, buttons, links, etc.) as needed
        });
      } else {
        addBotMessage('Sorry, I could not understand your request. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message to Rasa:', error);
      addBotMessage('Sorry, an error occurred. Please try again later.');
    }

    setInput('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleUserMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleUserMessage}>Send</button>
    </div>
  );
};

export default Chat;

