import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import chatIcon from '../assets/chatbot_logo.png';
import ChatPage from '../pages/chat';

import _ from 'lodash'; // lodash library

const Map = ({ setCoords, setBounds, coords = { lat: 0, lng: 0 }, places,weatherData, handlevisit }) => {
  const mapRef = useRef();
  const [debouncedFunction, setDebouncedFunction] = useState(null);
  const [showChat, setShowChat] = useState(false); // State to control chat page visibility



  useEffect(() => {
    setDebouncedFunction(() => _.debounce(handleBoundsChanged, 2000));
  }, []);

  const handleLoad = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  const toggleChat = () => {
    setShowChat(!showChat); // Toggle chat page visibility
  };

  const handleBoundsChanged = () => {
    const map = mapRef.current;
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    setBounds({ ne: { lat: ne.lat(), lng: ne.lng() }, sw: { lat: sw.lat(), lng: sw.lng() } });
  };

  const handleDragEnd = () => {
    const map = mapRef.current;
    setCoords({ lat: map.getCenter().lat(), lng: map.getCenter().lng() });
  };

  const handle_visit = (place_id) => {
    console.log("visited map", place_id);
    handlevisit(place_id);
  }
  const buttonStyle = {
    borderRadius: '50%',       // Makes the button circular
    backgroundColor: '#191970', // Midnight blue color
    color: 'white',             // Text color
    border: 'none',             // No border
    width: '60px',              // Adjust size as needed
    height: '60px',             // Adjust size as needed
    cursor: 'pointer',
    fontSize: '24px',         
  };

  const buttonStyle_open = {
    borderRadius: '50%',       // Makes the button circular
    backgroundColor: '#191970', // Midnight blue color
    color: 'white',             // Text color
    border: 'none',             // No border
    width: '60px',              // Adjust size as needed
    height: '60px',             // Adjust size as needed
    cursor: 'pointer',        
  };

  return (
    <div style={{ height: "90vh", width: "150vh" }}>
      <LoadScript googleMapsApiKey="AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={coords}
          zoom={14}
          options={{ disableDefaultUI: true, zoomControl: true }}
          onLoad={handleLoad}
          onBoundsChanged={debouncedFunction}
          onDragEnd={handleDragEnd}
        >
          {places?.map((place, i) => (
            <Marker
              key={i}
              position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
            />
          ))}
          <div style={{maxHeight:400}}>
          {showChat && (
            <div>
              <div style={{ position: "fixed", bottom: 40, right: 70 }}>
              <button style={buttonStyle} onClick={toggleChat}>X</button>
              </div>
              <div style={{ position: "fixed", bottom: 110, right: 70 }}>
              <ChatPage handle_VisitClick={handle_visit} />
              </div>
            </div>
          )}
          {!showChat && (
            <div style={{ position: "fixed", bottom: 34, right: 70 }}>
              
              <button style={buttonStyle_open} onClick={toggleChat}>
              <img src={chatIcon} alt="Chat Icon" style={{ position:'relative', left:'5px',  width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
              </button>
            </div>
          )}
          </div>
          
          {weatherData?.list?.length && weatherData.list.map((data, i) => (
          <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
            <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} height="70px" />
          </div>
        ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;