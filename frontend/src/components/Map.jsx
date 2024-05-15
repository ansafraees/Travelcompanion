import { useRef, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker,InfoWindow} from '@react-google-maps/api';

import _ from 'lodash'; // lodash library

const Map = ({ setCoords, setBounds, coords = { lat: 0, lng: 0 }, places }) => {
  const mapRef = useRef();
  const [debouncedFunction, setDebouncedFunction] = useState(null);



  useEffect(() => {
    setDebouncedFunction(() => _.debounce(handleBoundsChanged, 3000));
  }, []);

  const handleLoad = (mapInstance) => {
    mapRef.current = mapInstance;
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
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;