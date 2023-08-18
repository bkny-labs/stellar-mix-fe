// controller/MainController.tsx

import React, { useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlaylistsByQuery, getSpotifyAccessToken, getSunCalcData, getWeatherByLocation } from '../services/api-service';
import { setLoggedInAction, setSpotifyPlaylistsAction, setSunCalcAction, setWeatherAction } from '../model/actions';
import { AppState } from '../model/state';
import { setSpotifyPlaylists } from '../model/slice';
import { useLocation } from 'react-router-dom';

// Define the type for props
interface MainControllerProps {
  children: ReactNode;
}

const MainController: React.FC<MainControllerProps> = ({ children }) => {
  const spotifyToken = useSelector((state: AppState) => state.spotifyToken);
  const query = '70s funk';
  const dispatch = useDispatch();
  const location = useLocation();

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

  useEffect(() => {
    if (spotifyToken) {
      getPlaylistsByQuery(query, spotifyToken)
        .then(data => {
          dispatch(setSpotifyPlaylistsAction(data));
        })
        .catch(err => console.error("Error fetching playlists:", err));
    }
  }, [dispatch, spotifyToken]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
  
    if (code) {
      getSpotifyAccessToken(code)
        .then(accessToken => {
          // Store the access token in the state
          dispatch(setLoggedInAction(true, accessToken));
          localStorage.setItem('spotifyToken', accessToken);
  
          // Fetch the playlists when the token is available
          return getPlaylistsByQuery(query, accessToken);
        })
        .then(data => {
          // Dispatch the playlists to the Redux store
          dispatch(setSpotifyPlaylistsAction(data));
          // If you also want to store the playlists in local component state
          setSpotifyPlaylists(data);
        })
        .catch(err => console.error("Error:", err));
    }
  }, [dispatch, location.search]);
  

  return (<>{children}</>);
};

export default MainController;
