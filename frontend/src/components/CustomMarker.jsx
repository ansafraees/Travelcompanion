import {Paper} from '@mui/material';

const CustomMarker=({place})=>{
    return(
        <Paper elevation={3} style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px'}}>
            <img
              style={{ cursor: 'pointer' }}
              src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
              alt={place.name} // Add alt text for accessibility
            />
        </Paper>
    )
}

export default CustomMarker