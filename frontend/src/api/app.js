import axios from 'axios';

export const getPlacesData = async (type,sw,ne) => {
  try {
    console.log("type,sw,ne:",type,sw,ne)
    const response = await axios.get('http://localhost:5000/api/v1/users/places',{
      params: {
        type: type,
        sw_lat: sw.lat,
        ne_lat: ne.lat,
        sw_lng: sw.lng,
        ne_lng: ne.lng,
      }
    })
    console.log("data in getPlacesData:",response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
};


export const getWeatherData = async (lat, lng) => {
  try {
    const data= axios.get('http://localhost:5000/api/v1/users/weather', {
        params: {
          lat:lat,
          lng:lng
        },
    })
      return data;
    }
  catch (error) {
    console.log(error);
  }
} 

export const getTripData=async(type,lat,lng)=>{
  try{
    const response=await axios.get('http://localhost:5000/api/v1/users/trip',{
      params:{
        type:type,
        lat:lat,
        lng:lng
      }
    })
    console.log("data in tripData:",response.data)
    return response.data;
  }
  catch(err){
    console.log(err);
  }
}

export const getLocationData=async(type,lat,lng)=>{
  try{
    const response=await axios.get('http://localhost:5000/api/v1/users/location',{
      params:{
        type:type,
        lat:lat,
        lng:lng
      }
    })
    return response.data;
  }
  catch(err){
    console.log(err);
  }
}

export const getLocation=async(loc)=>{
  try{
    const apiKey = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU';
  const response=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(loc)}&key=${apiKey}`);
  const data=await response.json();
  const { lat, lng } = data.results[0].geometry.location;
  console.log(`in getlocation Latitude: ${lat}, Longitude: ${lng}`);
  return {lat,lng};
  }
  catch(error){
    console.log(error);
  }
}