import axios from 'axios';

export const getPlacesData = async (type,sw,ne) => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/users/places',{
      params: {
        type: type,
        sw_lat: sw.lat,
        ne_lat: ne.lat,
        sw_lng: sw.lng,
        ne_lng: ne.lng,
      }
    })
    return response.data; // Return data from the response
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Throw the error to be caught by the caller
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
    const data=await axios.get('http://localhost:5000/api/v1/users/trip',{
      params:{
        type:type,
        lat:lat,
        lng:lng
      }
    })
    console.log("data in api:",data)
    return data;
  }
  catch(err){
    console.log(err);
  }
}