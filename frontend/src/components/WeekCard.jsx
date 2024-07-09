import { useState } from 'react';
import {Typography,Box,Paper} from '@mui/material';
import Modal from './Modal'; 
import TripCard from './TripCard';

const Week = ({ itinerary }) => {
    const [selectedDay, setSelectedDay] = useState({
        index: '0',
        details: itinerary['0']
    });

    const handleDayClick = (index, details) => {
        setSelectedDay({ index, details });
    };

    return (
        <div className="w-10/12 " style={{ display: 'flex', flexDirection: 'column',alignContent:"center",justifyContent:'center'}}>
            <div style={{display: 'flex', flexDirection: 'row',justifyContent:'space-between',marginBottom:10}}>
                {Object.entries(itinerary).map(([index, details]) => (
                    <Paper 
                    style={{ 
                        flex: '1', 
                        margin: '10px', 
                        cursor: 'pointer' 
                    }} 
                    elevation={3} 
                    onClick={() => handleDayClick(index,details )}
                    key={index}
                >
                    <Box p={1} className="p-5 bg-slate-950 flex flex-row justify-center items-center rounded hover:bg-zinc-500">
                        <Typography gutterBottom variant="h5"style={{ color: 'white' }} >
                            Day {parseInt(index) + 1}
                        </Typography>
                    </Box>
                </Paper>
            ))}
            </div>
            
            {selectedDay && (
                <div style={{
                backgroundColor: 'white', // Set the background color to white
                padding: '20px', // Add some padding
                borderRadius: '10px', // Round the corners
                boxShadow: '0px 10px 20px rgba(0,0,0,0.19)',
                overflow: 'auto', // Add a scrollbar if the content is too tall
                maxHeight: '80vh', // Prevent the modal from becoming taller than the screen
                }} >
                {Object.entries(selectedDay.details).map(([time, detail]) => (
                    <TripCard key={`${selectedDay.index}-${time}`} time={time} details={detail} />
                ))}
                </div>
              
            )}
        </div>
    );
};

export default Week;