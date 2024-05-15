import { useState, useEffect } from 'react';
import List from '../components/Tofind'
import Map from '../components/Map'
import Navbar from '../components/Navbar';
import { getPlacesData } from '../api/app';

const Home=()=>{
  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [type,setType]=useState("restaurants");
  const [rating,setRating]=useState('All');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);

    setFilteredPlaces(filtered);
  },[rating]);
  
  const handlePlaceChanged = async() => {
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
    console.log('coords,bounds',coords,bounds);
    setIsLoading(true)
    if(bounds) getPlacesData(type,bounds.sw,bounds.ne)
      .then((data) => {
        setPlaces(data)
        setFilteredPlaces([]);
        setRating('');
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
  },[type,bounds]);
  
    return (
        <div className='h-screen w-screen'>
            <div>
                <Navbar handlePlaceChanged={handlePlaceChanged} setSearchInput={setSearchInput} searchInput={searchInput}/>
            </div>
            <div className='mt-0.5 flex flex-row justify-between'>
              <List 
                isLoading={isLoading}
                places={filteredPlaces.length ? filteredPlaces : places}
                type={type}
                setType={setType}
                rating={rating}
                setRating={setRating}/>
              {coords && <Map 
                setCoords={setCoords}
                setBounds={setBounds}
                coords={coords}
                places={places}/>}
            </div>
        </div>  
    );
}

export default Home;