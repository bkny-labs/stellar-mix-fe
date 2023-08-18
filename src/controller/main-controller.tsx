// controller/MainController.tsx

import React, { useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { getSunCalcData, getWeatherByLocation } from '../services/api-service';
import { setSunCalcAction, setWeatherAction } from '../model/actions';

// Define the type for props
interface MainControllerProps {
  children: ReactNode;
}

const MainController: React.FC<MainControllerProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const lat = 40.732542;
    const lon = -73.978773;

    const fetchWeather = async () => {
      try {
        const weatherData = await getWeatherByLocation(lat, lon);
        dispatch(setWeatherAction(weatherData));
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        // Handle error, if necessary
      }
    };

    const fetchSunCalc = async () => {
      try {
        const data = await getSunCalcData(lon, lat);
        dispatch(setSunCalcAction(data));
      } catch (error) {
        console.error('Failed to fetch SunCalc data:', error);
        // Handle error, if necessary
      }
    };

    fetchWeather();
    fetchSunCalc();

  }, [dispatch]);

  return (<>{children}</>);
};

export default MainController;
