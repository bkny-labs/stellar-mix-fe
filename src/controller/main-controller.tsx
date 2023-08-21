import React, { useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPlaylistsByQuery, getSpotifyAccessToken,
  getSunCalcData, getWeatherByLocation
} from '../services/api-service';
import {
  setLoggedInAction, setSpotifyPlaylistsAction,
  setSunCalcAction, setWeatherAction
} from '../model/actions';
import { AppState } from '../model/state';
import { buildPlaylistQuery, getMusicalMood } from '../utils/generate-spotify-query';

interface MainControllerProps {
  children: ReactNode;
}

const MainController: React.FC<MainControllerProps> = ({ children }) => {
  const spotifyToken = useSelector((state: AppState) => state.spotifyToken);
  const moodData = getMusicalMood(useSelector((store: AppState) => store));
  const playlistQuery = buildPlaylistQuery(moodData);

  const dispatch = useDispatch();

  const fetchSpotifyPlaylists = async () => {
    if (!spotifyToken || !playlistQuery) return;

    try {
      const data = await getPlaylistsByQuery(playlistQuery, spotifyToken, dispatch);
      dispatch(setSpotifyPlaylistsAction(data));
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  };

  const handleSpotifyError = (err: any) => {
    if (err.response) {
      err.response.json().then((errorData: any) => {
        console.error("Detailed Spotify Error:", errorData);
      });
    } else {
      console.error("Error:", err);
    }
  };

  const fetchWeatherAndSunCalcData = async () => {
    const lat = 40.732542;
    const lon = -73.978773;

    try {
      const weatherData = await getWeatherByLocation(lat, lon);
      dispatch(setWeatherAction(weatherData));
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }

    try {
      const data = await getSunCalcData(lon, lat);
      dispatch(setSunCalcAction(data));
    } catch (error) {
      console.error('Failed to fetch SunCalc data:', error);
    }
  };

  const handleAccessToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) return;

    try {
      await getSpotifyAccessToken(code, dispatch);
      const storedToken = localStorage.getItem('spotifyToken');
      if (storedToken) {
        dispatch(setLoggedInAction(true, storedToken));
      }
    } catch (error) {
      handleSpotifyError(error);
    }
};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
        handleAccessToken();
    } else {
        const tokenFromStorage = localStorage.getItem('spotifyToken');
        if (tokenFromStorage) {
            dispatch(setLoggedInAction(true, tokenFromStorage));
        }
    }

    fetchWeatherAndSunCalcData();
    fetchSpotifyPlaylists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    // Attempt to get genres from localStorage
    const storedGenres = localStorage.getItem('genres');

    if (storedGenres) {
      // If genres exist in localStorage, parse and dispatch to Redux
      const parsedGenres = JSON.parse(storedGenres);
      dispatch(setGenresAction(parsedGenres));
    }
  }, [dispatch]);


  return (<>{children}</>);
};

export default MainController;
function setGenresAction(parsedGenres: any): any {
  throw new Error('Function not implemented.');
}

