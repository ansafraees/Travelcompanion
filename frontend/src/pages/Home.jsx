import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Widget, addResponseMessage, renderCustomComponent } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { getPlacesData } from '../api/app';
import bot_avatar from '../assets/chatbot_avatar.png';
import title_avatar from '../assets/chatbot_logo.png';
import CustomMessage from '../components/CustomMessage';
import Map from '../components/Map';
import Navbar from '../components/Navbar';
import List from '../components/Tofind';
import Chat_Card_Container from '../components/chat_card';
import './home.css';

const Home = () => {
  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('All');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const hasAddedWelcomeMessage = useRef(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces(filtered);
  }, [rating, places]);

  useEffect(() => {
    if (!hasAddedWelcomeMessage.current) {
      sendHiMessageToRasa();
      hasAddedWelcomeMessage.current = true;
    }
  }, []);



  const handleVisitClick = async (place_id) => {
    console.log(place_id);
    try{
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("Data: ${Data}");
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      setCoords({ lat, lng });
    } else {
      throw new Error('Place not found');
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error);
  }
  };

  const sendHiMessageToRasa = async () => {
    try {
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          message: 'hi', // Send 'hi' message to trigger bot's greeting
        }),
      });

      const data = await response.json();
      console.log('Response from Rasa:', data);
  
      if (data && data.length > 0) {
        data.forEach((res, index) => {
          console.log(`Processing response index ${index}:`, res);
          let ishandled=false;
  
          if (res.text) {
            console.log('Adding text response:', res.text);
            addResponseMessage(res.text);
            ishandled=true;
          } if (res.custom && res.custom.image) {
            ishandled=true;
            const content = { type: 'image', url: res.custom.image };
            console.log('Adding image response:', content);
            renderCustomComponent(CustomMessage, { content });
          }if (res.buttons && res.buttons.length > 0) {
            console.log('Adding button responses:', res.buttons);
            res.buttons.forEach(button => {
              const content = {
                type: 'button',
                label: button.title,
                onClick: () => handleButtonClick(button.payload)
              };
              console.log('Rendering button:', content);
              renderCustomComponent(CustomMessage, { content });
            });
            ishandled = true;
          } if (res.custom && res.custom.link) {
            ishandled=true;
            console.log('Adding link response:', res.custom.link);
            renderCustomComponent(CustomMessage, {
              type: 'link',
              url: res.custom.link,
              text: res.custom.text,
            });
          } if(ishandled==false) {
            console.warn(`Received unknown message type at index ${index}:`, res);
          }
        });
      } else {
        addResponseMessage('Sorry could not understand your request. Please rephrase it');
      }

    } catch (error) {
      console.error('Error sending initial message to Rasa server:', error);
    }
  };

  const handleNewUserMessage = async (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
  
    try {
      const position = await get_CurrentPosition();
      const { latitude, longitude } = position.coords;

      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          message: newMessage,
          metadata: {
            location: {
              latitude,
              longitude
            }
          }
        }),
      });
  
      const data = await response.json();
      console.log('Response from Rasa:', data);
  
      if (data && data.length > 0) {
        data.forEach((res, index) => {
          console.log(`Processing response index ${index}:`, res);
          let ishandled=false;
  
          if (res.text) {
            console.log('Adding text response:', res.text);
            addResponseMessage(res.text);
            ishandled=true;
          }
           if (res.custom && res.custom.image) {
            ishandled=true;
            const content = { type: 'image', url: res.custom.image };
            console.log('Adding image response:', content);
            renderCustomComponent(CustomMessage, { content });
          }
          if (res.buttons && res.buttons.length > 0) {
            console.log('Adding button responses:', res.buttons);
            res.buttons.forEach(button => {
              const content = {
                type: 'button',
                label: button.title,
                onClick: () => handleButtonClick(button.payload)
              };
              console.log('Rendering button:', content);
              renderCustomComponent(CustomMessage, { content });
            });
            ishandled = true;
          } 
          if (res.custom && res.custom.link) {
            ishandled=true;
            console.log('Adding link response:', res.custom.link);
            renderCustomComponent(CustomMessage, {
              type: 'link',
              url: res.custom.link,
              text: res.custom.text,
            });
          }
          if (res.custom && res.custom.content) {
            console.log('Rendering restaurant cards:', res.custom.content); // Log the restaurants data
          renderCustomComponent(Chat_Card_Container, { cards: res.custom.content, onVisitClick: handleVisitClick });
            ishandled = true;
          }
          if(ishandled==false) {
            console.warn(`Received unknown message type at index ${index}:`, res);
          }
        });
      } else {
        addResponseMessage('Sorry could not understand your request. Please rephrase it');
      }
    } catch (error) {
      console.error('Error sending message to Rasa server:', error);
    }
  };
  
  const handleButtonClick = async (payload) => {
    console.log(`Button ${Button}clicked with payload: ${payload}`);
  
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
          let ishandled=false;
          console.log(`Processing response index ${index} from button click:`, res);
  
          if (res.text) {
            ishandled=true;
            console.log('Adding text response:', res.text);
            addResponseMessage(res.text);
          } if (res.custom && res.custom.image) {
            ishandled=true;
            const content = { type: 'image', url: res.custom.image };
            console.log('Adding image response:', content);
            renderCustomComponent(CustomMessage, { content });
          } if (res.buttons && res.buttons.length > 0) {
            ishandled=true;
            console.log('Adding button responses:', res.buttons);
            res.buttons.forEach(button => {
              console.log('Rendering button:', button.title);
              const content = {
                type: 'button',
                label: button.title,
                onClick: () => handleButtonClick(button.payload)
              };
              renderCustomComponent(CustomMessage, { content });
            });
          }
          if (res.custom && res.custom.content) {
            res.custom.content.forEach((restaurant) => {
              renderCustomComponent(Chat_Card_Container, { restaurant });
            });
            ishandled = true;
          }
           if (res.custom && res.custom.link) {
            ishandled=true;
            console.log('Adding link response:', res.custom.link);
            const content = {
              type: 'link',
              url: res.custom.link,
              text: res.custom.text,
            };
            renderCustomComponent(CustomMessage, {content});
          } if(ishandled==false) {
            console.warn(`Received unknown message type at index ${index}:`, res);
          }
        });
      } else {
        addResponseMessage('Sorry could not understand your request. Please rephrase it');
      }
    } catch (error) {
      console.error('Error sending message to Rasa server:', error);
    }
  };
  
  

  const handlePlaceChanged = async () => {
    try {
      console.log('Search input:', searchInput);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCoords({ lat:lat,lng:lng });
      } else {
        throw new Error('Place not found');
      }
    } catch (error) {
      console.error('Error fetching geolocation:', error);
    }
  };

  useEffect(() => {
    console.log('coords,bounds', coords, bounds);
    setIsLoading(true);
    if (bounds) {
      getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
          setPlaces(data);
          setFilteredPlaces([]);
          setRating('');
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    }
  }, [type, bounds]);

   // Function to get the current position of the user
   const get_CurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className='h-screen w-screen' style={{ overflow: 'hidden' }}>
      <div className='chat-widget-container'>
        <Widget handleNewUserMessage={handleNewUserMessage} 
         title="Travel Assistant"
         subtitle=""
         profileAvatar={bot_avatar}
         titleAvatar={title_avatar}
         showBadge = "true"
        />
      </div>
      <div>
        <Navbar handlePlaceChanged={handlePlaceChanged} setSearchInput={setSearchInput} searchInput={searchInput} />
      </div>
      <div className='mt-0.5 flex flex-row justify-between'>
        <List
          isLoading={isLoading}
          places={filteredPlaces.length ? filteredPlaces : places}
          type={type}
          setType={setType}
          rating={rating}
          setRating={setRating}
        />
        {coords && (
          <Map
            setCoords={setCoords}
            setBounds={setBounds}
            coords={coords}
            places={places}
          />
        )}
      </div>
    </div>
  );
};

export default Home;