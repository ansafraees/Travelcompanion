import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTripData,getPlacesData,getLocationData } from '../api/app'; 
import { Typography } from '@mui/material';
import { sortAttractions ,weekItinerary} from '../api/trip';
import TripCard from '../components/TripCard';
import WeekCard from '../components/WeekCard';
import Loading from '../components/Loading';

const WeekTrip = () => {
  const {lat,lng,type}= useParams();
  const [tripData, setTripData] = useState(null);
  const [foodData,setFoodData] =useState(null)
  const latNum = parseFloat(lat);
const lngNum = parseFloat(lng);

const bounds = {
  sw: { lat: latNum - 0.033052, lng: lngNum - 0.05481 },
  ne: { lat: latNum + 0.033052, lng: lngNum + 0.05481 }
};

  let itinerary;

  const generateDayItinerary = (sortedRestaurants, sortedAttractions) => {
    const itinerary = {};
    itinerary[8] = sortedRestaurants[0];
    itinerary[14] = sortedRestaurants[1];
    itinerary[20] = sortedRestaurants[2];

    if (sortedAttractions.length > 0) {
        
        let attractionTimes;
        switch (sortedAttractions.length) {
            case 1:
                attractionTimes = [9];
                break;
            case 2:
                attractionTimes = [9, 18];
                break;
            case 3:
                attractionTimes = [9, 15, 18];
                break;
            default:
                attractionTimes = [9, 12, 15, 18];
                break;
        }

        for (let i = 0; i < 4; i++) {
            itinerary[attractionTimes[i]] = sortedAttractions[i];
        }
      }    
    return itinerary;
};


  useEffect(() => {
    const fetchData = async () => {
      const fetchFoodData = async () => {
        const data = await getTripData('restaurant', lat, lng); 
        setFoodData(data);
      };
    
      const fetchTripData = async () => {
        console.log("fetching data")
        const data = await getPlacesData('attractions', bounds.sw, bounds.ne); 
        setTripData(data);
      };
    
      await fetchTripData();
      await fetchFoodData();
      console.log("over")
    };
    fetchData();
  },[]);

  if (!tripData || !foodData) {
    return <div className='bg-gradient-to-r from-indigo-500 h-screen w-screen'><Loading/></div>;
  }

  
  const sortedRestaurants=foodData.sort((a, b) => (b.user_ratings * b.rating) - (a.user_ratings * a.rating)).slice(0, 21);
  


if(type==='day') {
  const sortedAttractions = tripData.sort((a, b) => (b.ratings * b.num_reviews) - (a.ratings * a.num_reviews)).slice(0,10);
  itinerary = generateDayItinerary(sortedRestaurants, sortedAttractions);
  console.log("itinerary:",itinerary)
}
else{
  const weekAttractions=sortAttractions(tripData);
  itinerary = weekItinerary(weekAttractions,sortedRestaurants);
  console.log("WeekItinerary:",itinerary)
} 
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', 
    }} className='bg-slate-900 h-screen w-screen'>
      <div className="w-10/12 bg-gray-700 flex flex-row flex-wrap justify-center items-center" style={{

        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23)', overflow: 'auto',maxHeight: '90vh'
      }}>
        {type === 'day' ? (
      <div style={{ display: 'flex', flexDirection: 'column', width:'125vh', alignContent:"center",justifyContent:'center'}}>
        <div style={{marginBottom:10}}>
          <Typography className="text-white"gutterBottom variant="h2">A Day's Itinerary</Typography>
          {Object.entries(itinerary).map(([time, details]) => (
            <div key={time}>
              <TripCard time={time} details={details} />
            </div>
          ))}
        </div>
      </div>  
    ) :<WeekCard itinerary={itinerary}/> }
      </div>
    </div>
  );
};

export default WeekTrip;