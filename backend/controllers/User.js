const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User=require('../models/User');
const axios=require('axios')

require('dotenv').config()

const jwtSecret=process.env.SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const userLogin=async(req,res,next)=>{
    const {username,password}=req.body
    const user=await User.findOne({username})
    if(!user) next(createCustomError('user not found'))
    if(bcrypt.compareSync(password,user.password)){
        jwt.sign({ userId: user._id, username }, jwtSecret, {}, (err, token) => {
            if (err) {
                return next(err);
            }
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(200).json({ id: user._id });
        });
    }
}

const registerUser = async (req, res, next) => {
    console.log("entered")
    const { username, password } = req.body;
    console.log({ username, password })
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    
    const user = await User.create({
        username: username,
        password: hashedPassword,
    });

    if (!user) {
        return next(createCustomError('User not created'));
    }

    jwt.sign({ userId: user._id, username }, jwtSecret, {}, (err, token) => {
        if (err) {
            return next(err);
        }
        res.cookie('token', token, { sameSite: 'none', secure: true }).status(200).json({ id: user._id });
    });
};

const places = async (req, res) => {
  try {
    const { type,sw_lat, ne_lat ,sw_lng, ne_lng } = req.query;
    const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
      params: {
        bl_latitude: sw_lat,
        bl_longitude: sw_lng,
        tr_longitude: ne_lng,
        tr_latitude: ne_lat,
      },
      headers: {
        'X-RapidAPI-Key': 'eafa865b4cmsh84853cf1d470593p121d9cjsna5bc19bfbed2',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
      },
    });
    console.log(data);
    return res.json(data); // Return data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
};

const weather=async(req,res)=>{
  try {
    const { lat, lng }=req.query
    const { data:{data }} = await axios.get('https://open-weather-map27.p.rapidapi.com/weather', {
      params: { lat, lon: lng },
      headers: {
        'x-rapidapi-key': 'a896c05889msh2ee7b323423031ap12dbbejsn559a20f16ca6',
        'x-rapidapi-host': 'open-weather-map27.p.rapidapi.com',
      },
    });
    res.json(data);
    
  } catch (error) {
    console.log(error);
  }
}

const trip=async(req,res)=>{
  try{

    const apiKey = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU';
    const {type,lat,lng}=req.query;
    const radius = 5000; 
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
    
    
    const response=await fetch(apiUrl);
    if(!response) throw new error("Network error");
    const data=await response.json();
    if (!data.results) throw new error("No results found");
    const attractions = data.results.map(result => ({
      name: result.name,
      address: result.vicinity,
      rating: result.rating,
    }));
    console.log(attractions);
    return attractions
  }
  catch(error){
    console.error('Error fetching attractions:', error);
  }
}

module.exports={registerUser,userLogin,places,weather,trip}