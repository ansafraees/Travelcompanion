import { Box, Typography, Card, CardContent } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlaceCard from './PlaceCard';

const TripCard = ({ time, details}) => {
    console.log('TripCard:', time, details)
    if(time==8 || time==14 || time==20) return (
        <Card elevation={6}>
            <CardContent>
            <Typography gutterBottom variant="h5">
                {time == 8 ? 'Breakfast' : time == 14 ? 'Lunch' : 'Dinner'} at {time}:00</Typography>
                <Typography gutterBottom variant="h5">{details.name}</Typography>
                <Box display="flex" justifyContent="space-between" my={2}>
                    <Typography component="legend">{details.rating} rating{details.user_ratings > 1 && 's'}</Typography>
                    <Typography component="legend">{details.user_ratings} review{details.user_ratings > 1 && 's'}</Typography>
                </Box>
                {details.address && (
                    <Typography gutterBottom variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                        <LocationOnIcon />{details.address}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
    else return(
        <div style={{margin:2}}>
            <Typography gutterBottom variant="h5">At {time}:00</Typography>
            <PlaceCard place={details} />
        </div>
    )
};

export default TripCard;