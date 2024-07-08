import React, { useEffect, useRef, useState } from 'react';
import Chat_Card_Container from '../components/chat_card';
import './chat.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [buttons, setButtons] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = { sender: 'user', text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          message: inputMessage,
        }),
      });

      const data = await response.json();
      console.log('Response from Rasa:', data);

      if (data && data.length > 0) {
        data.forEach((res, index) => {
          console.log(`Processing response index ${index}:`, res);
          let ishandled = false;

          if (res.text) {
            console.log('Adding text response:', res.text);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: res.text }]);
            ishandled = true;
          }
          if (res.custom && res.custom.image) {
            ishandled = true;
            const content = { type: 'image', url: res.custom.image };
            console.log('Adding image response:', content);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'image', content }]);
          }
          if (res.buttons && res.buttons.length > 0) {
            console.log('Adding button responses:', res.buttons);
            const mappedButtons = res.buttons.map((button) => ({
              type: 'button',
              label: button.title,
              onClick: () => handleButtonClick(button.payload),
            }));
            setButtons(mappedButtons); // Store the buttons in state
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'buttons', buttons: mappedButtons }]);
            ishandled = true;
          }
          if (res.custom && res.custom.link) {
            ishandled = true;
            console.log('Adding link response:', res.custom.link);
            const content = {
              type: 'link',
              url: res.custom.link,
              text: res.custom.text,
            };
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'link', content }]);
          }
          if (res.custom && res.custom.content) {
            console.log('Rendering restaurant cards:', res.custom.content);
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: 'bot', type: 'cards', content: res.custom.content },
            ]);
            ishandled = true;
          }
          if (!ishandled) {
            console.warn(`Received unknown message type at index ${index}:`, res);
          }
        });
      } else {
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Sorry, could not understand your request. Please rephrase it.' }]);
      }
    } catch (error) {
      console.error('Error sending message to Rasa server:', error);
    }

    setInputMessage('');
  };

  const handleVisitClick = (place_id) => {
    console.log('Visit clicked for place_id:', place_id);
  };

  const handleButtonClick = async (payload) => {
    const newMessage = { sender: 'user', text: payload };

    try {
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          message: payload,
        }),
      });

      const data = await response.json();
      console.log('Response from Rasa (button click):', data);

      if (data && data.length > 0) {
        data.forEach((res, index) => {
          let ishandled = false;
          console.log(`Processing response index ${index} from button click:`, res);

          if (res.text) {
            ishandled = true;
            console.log('Adding text response:', res.text);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: res.text }]);
          }
          if (res.custom && res.custom.image) {
            ishandled = true;
            const content = { type: 'image', url: res.custom.image };
            console.log('Adding image response:', content);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'image', content }]);
          }
          if (res.buttons && res.buttons.length > 0) {
            ishandled = true;
            console.log('Adding button responses:', res.buttons);
            const mappedButtons = res.buttons.map((button, index) => {
              console.log(`Button ${index}:`, button); // Log each button object
              return {
                type: 'button',
                label: button.title,
                onClick: () => handleButtonClick(button.payload),
              };
            });
            setButtons(mappedButtons); // Store the buttons in state
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'buttons', buttons: mappedButtons }]);
          }
          if (res.custom && res.custom.link) {
            ishandled = true;
            console.log('Adding link response:', res.custom.link);
            const content = {
              type: 'link',
              url: res.custom.link,
              text: res.custom.text,
            };
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'link', content }]);
          }
          if (res.custom && res.custom.content) {
            ishandled = true;
            console.log('Rendering restaurant cards:', res.custom.content);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'cards', content: res.custom.content }]);
          }
          if (!ishandled) {
            console.warn(`Received unknown message type at index ${index}:`, res);
          }
        });
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Sorry, could not understand your request. Please rephrase it.' },
        ]);
      }
    } catch (error) {
      console.error('Error sending message to Rasa server:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat with Rasa</div>
      <div className="chat-messages">
        {messages.map((msg, index) => {
          if (msg.type === 'cards') {
            return (
              <div key={index}>
                <Chat_Card_Container cards={msg.content} onVisitClick={handleVisitClick} />
              </div>
            );
          }
          if (msg.type === 'buttons') {
            return (
              <div key={index} className='flex flex-col'>
                {msg.buttons.map((button, idx) => (
                  <button
                    key={idx}
                    className="response-button"
                    onClick={button.onClick} // Use button's onClick directly
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            );
          }
          if (msg.type === 'image') {
            return (
              <div key={index} className={`message bot-message`}>
                <img src={msg.content.url} alt="Response" className="response-image" />
              </div>
            );
          }
          return (
            <div key={index} className={`message ${msg.sender}-message`}>
              {msg.text}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
