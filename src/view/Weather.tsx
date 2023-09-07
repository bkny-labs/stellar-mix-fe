// views/Weather.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { selectWeather } from '../store/selectors';

const Weather: React.FC = () => {
  const weatherData = useSelector(selectWeather);

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div>
        <p>Temperature: {((weatherData.main?.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</p>
        <p>Weather: {weatherData.weather[0]?.description}</p>
        <p>Humidity: {weatherData.main?.humidity}%</p>
    </div>
  );
};

export default Weather;
