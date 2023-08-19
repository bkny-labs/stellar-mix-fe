// controller/MainController.tsx

import React, { useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlaylistsByQuery, getSpotifyAccessToken, getSunCalcData, getWeatherByLocation } from '../services/api-service';
import { setLoggedInAction, setSpotifyPlaylistsAction, setSunCalcAction, setWeatherAction } from '../model/actions';
import { AppState } from '../model/state';
import { setSpotifyPlaylists } from '../model/slice';
import { useLocation } from 'react-router-dom';
import { buildPlaylistQuery, getMusicalMood } from '../utils/generate-spotify-query';

// Define the type for props
interface MainControllerProps {
  children: ReactNode;
}

const MainController: React.FC<MainControllerProps> = ({ children }) => {
  const spotifyToken = useSelector((state: AppState) => state.spotifyToken);
  const moods = getMusicalMood(useSelector((store: AppState) => store));
  const playlistQuery = buildPlaylistQuery(moods);

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
      }
    };

    const fetchSunCalc = async () => {
      try {
        const data = await getSunCalcData(lon, lat);
        dispatch(setSunCalcAction(data));
      } catch (error) {
        console.error('Failed to fetch SunCalc data:', error);
      }
    };

    fetchWeather();
    fetchSunCalc();

  }, [dispatch]);

  useEffect(() => {
    if (spotifyToken) {
      getPlaylistsByQuery(playlistQuery, spotifyToken)
        .then(data => {
          dispatch(setSpotifyPlaylistsAction(data));
        })
        .catch(err => console.error("Error fetching playlists:", err));
    }
  }, [dispatch, playlistQuery, spotifyToken]);

  const fetchSpotifyData = () => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
  
    if (code) {
      console.log("Using code for token:", code);
      getSpotifyAccessToken(code)
        .then(accessToken => {
          console.log("Fetched Access Token: ", accessToken);
          dispatch(setLoggedInAction(true, accessToken));
          localStorage.setItem('spotifyToken', accessToken);
          return getPlaylistsByQuery(playlistQuery, accessToken);
        })
        .then(data => {
          dispatch(setSpotifyPlaylistsAction(data));
          setSpotifyPlaylists(data);
        })
        .catch(err => {
          if (err.response) {
            err.response.json().then((errorData: any) => {
              console.error("Detailed Spotify Error:", errorData);
            });
          } else {
            console.error("Error:", err);
          }
        });
    }
  };
  
  useEffect(() => {
    fetchSpotifyData();
  }, []);
  
  

  return (<>{children}</>);
};

export default MainController;
