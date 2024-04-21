import GoogleMapReact from 'google-map-react';
import {Paper} from '@mui/material';

// Create a separate component for the Marker
const Marker = ({place}) => (
  <div lat={Number(place.latitude)}
  lng={Number(place.longitude)} style={{ position: 'absolute', transform: 'translate(-50%, -50%)',zIndex:1000}}>
    <Paper elevation={3} style={{padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px',}}>
            <img
              style={{ cursor: 'pointer' }}
              src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
              alt={place.name} // Add alt text for accessibility
            />
        </Paper>
  </div>
);

const Map = ({setCoords,setBounds,coords,places}) => {

  return (
    <div style={{ height: "85vh", width: "150vh" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU" }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{ disableDefaultUI: true, zoomControl: true,}}
        onChange={(e) => {
          setCoords({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={""}
      >
        {places?.map((place, i) => (
          <Marker
            key={i}
            place={place}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
