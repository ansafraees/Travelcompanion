// CustomMessage.jsx

import React from 'react';
import './CustomMessages.css';

const CustomMessage = ({ content }) => {
  console.log('button here');
  if (!content || !content.type) {
    console.log('CustomMessage received invalid content:', content);
    return null;
  }

  return (
    <div className="custom-message">
      {content.type === 'text' && <p>{content.text}</p>}
      {content.type === 'image' && (
        <img className="custom-image" src={content.url} alt="custom" style={{ maxWidth: 180 }} />
      )}
      {content.type === 'button' && (
        <button className="custom-button" onClick={content.onClick}>{content.label}</button>
      )}
      {content.type === 'link' && (
        <a href={content.url} target="_blank" rel="noopener noreferrer">
          {content.text || 'Click here'}
        </a>
      )}
      {/* Add more types as needed */}
    </div>
  );
};

export default CustomMessage;
