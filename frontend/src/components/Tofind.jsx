import { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import PlaceCard from './PlaceCard'

const List = ({places,type, setType, rating, setRating, isLoading })=>{
  
  
  return (
    <div style={{padding: 25, maxWidth: 700}}>
      <Typography variant="h4">Food & Dining around you</Typography>
      {isLoading ? (
        <div style={{height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
      <FormControl style={{minWidth: 120, marginBottom:30,margin:1}}>
          <InputLabel id="type">Type</InputLabel>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{minWidth: 120, marginBottom:30,margin:1}}>
            <InputLabel id="rating">Rating</InputLabel>
            <Select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="3">Above 3.0</MenuItem>
              <MenuItem value="4">Above 4.0</MenuItem>
              <MenuItem value="4.5">Above 4.5</MenuItem>
            </Select>
          </FormControl>
          
          <Grid container spacing={3} style={{marginTop:10,height: '75vh', overflow: 'auto'}} >
            {places?.map((place, i) => (
              <Grid key={i} item xs={25}>
                {place.name && <PlaceCard place={place}/>}
              </Grid>
            ))}
          </Grid>
          </>
      )}
       </div> 
  )    
};

export default List;