import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useState } from 'react';
import './chat_card.css';

const Chat_Card = ({ content_info, onVisitClick }) => (
  <Box width="300px">
    <Card style={{ margin: '10px', minWidth: '300px', maxWidth: '300px', Height: '400px'}}>
      {content_info && content_info.photo_url && (
        <CardMedia
          component="img"
          alt={content_info.name}
          height="140px"
          style={{ objectFit: 'cover' , height: '240px' }}
          image={content_info.photo_url}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {content_info ? content_info.name : 'No name available'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content_info ? content_info.vicinity : 'No vicinity available'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rating: {content_info ? content_info.rating : 'No rating available'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total reviews: {content_info ? content_info.user_ratings_total : 'No reviews available'}
        </Typography>
        <Button
                    variant="contained"
                    color="primary"
                    style={{ left: '115px' , bottom: '16px' , position: 'absolute'}}
                    onClick={() => onVisitClick(content_info.place_id)}
                >
                    Visit Here
        </Button>
      </CardContent>
    </Card>
  </Box>
);

const Chat_Card_Container = ({ cards = [], onVisitClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="chat-card-container">
      <Button className="scroll-button left" onClick={handlePrevClick} disabled={currentIndex === 0}>
        {'<'}
      </Button>
      {currentCard && <Chat_Card content_info={currentCard} onVisitClick={onVisitClick}/>}
      <Button className="scroll-button right" onClick={handleNextClick} disabled={currentIndex === cards.length - 1}>
        {'>'}
      </Button>
    </div>
  );
};

export default Chat_Card_Container;



