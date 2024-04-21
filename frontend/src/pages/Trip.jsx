import React, { useEffect, useState } from 'react';
import { getTripData } from '../api/app'; // replace with actual path
import './trip.css';

const YourComponent = () => {
  const [tripData, setTripData] = useState(null);
  const [location, setLocation] = useState({ loc: '' }); // Update initial state
  const [duration, setDuration] = useState('1 week');
  const [type, setType] = useState(''); // Define type state

  const { loc } = location; // Destructure loc from location

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTripData(type, loc); // Pass loc instead of lat and lng
      setTripData(data);
    };

    fetchData();
  }, [type, loc]); // Update dependencies

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Location:", location.loc);
    console.log("Duration:", duration);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocation({
      ...location,
      [name]: value,
    });
  };

  return (
    <div className="trip-page-wrapper">
      <div className="page-container">
        <form onSubmit={handleSubmit}>
          <label1>
            Enter Location:
            <input type="text" name="loc" value={loc} onChange={handleChange} placeholder=" Search" /><br /> {/* Update value to loc */}
          </label1>
          <label2>
            Duration:
            <select name="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="1 day">1 day</option>
              <option value="1 week">1 week</option>
              <option value="2 week">2 week</option>
            </select>
          </label2><br />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
      <div>
        {tripData && (
          <div>
            {/* Render trip data here */}
          </div>
        )}
      </div>
      </div>
  );
};

export default YourComponent;



