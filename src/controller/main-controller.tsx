import { Provider } from 'react-redux';
import {
  fetchUserProfile, getSpotifyAccessToken, logout } from '../services/auth-service';
import { getPlaylistsByQuery } from '../services/spotify-service';
import { getSunCalcData } from '../services/suncalc-service';
import { getWeatherByLocation } from '../services/weather-service';
import { setSpotifyPlaylistsAction,
  setSunCalcAction, setWeatherAction
} from '../store/actions';
import { buildPlaylistQuery, getMusicalMood } from '../utils/generate-spotify-query';
import { createRoot } from 'react-dom/client';
import App from '../App';
import { store } from '../store/store';
import { setMoodData } from '../store/slice';

export default class MainController {
  private spotifyToken = localStorage.getItem('spotifyToken');
  private moodData: any;
  private store: any;
  private params = new URLSearchParams(window.location.search);
  private code = this.params.get('code');
  private tokenCheckInterval?: NodeJS.Timeout;

  constructor(
    store: any
    ) {
    this.store = store;
    this.updateFromStore();

    store.subscribe(() => {
      this.updateFromStore();
    });
  }

  private checkTokenExpiration = () => {
    if (!this.hasValidToken()) {
      logout(this.store.dispatch); 
    }
  };

  private updateFromStore() {
    const state = this.store.getState();
    // Update token from the store state if available
    if (state.spotifyToken) {
      this.setSpotifyToken(state.spotifyToken);
    }
  }

  private setSpotifyToken(token: string) {
    this.spotifyToken = token;
    localStorage.setItem('spotifyToken', token);
  }

  private getSpotifyToken() {
    return this.spotifyToken || localStorage.getItem('spotifyToken');
  }


  public updateMoodData = (data: any) => {
    if (data) {
      const state = this.store.getState();
      this.moodData = data;
      this.store.dispatch(setMoodData(data));
      getMusicalMood({ ...state, moodData: data }, true); // Pass the updated state with new moodData
      localStorage.setItem('moodData', JSON.stringify(data));
      console.log('Updated mood data:', data);
      this.fetchSpotifyPlaylists();
    }
  };
  

  public fetchSpotifyPlaylists = () => {
    if (!this.spotifyToken) {
      console.error('Spotify token is not available.');
      return;
    }
  
    const playlistQuery = buildPlaylistQuery({
      moods: this.moodData,
      genres: []
    });
  
    if (!playlistQuery) {
      console.error('Playlist query is invalid.');
      return;
    }
  
    console.log('Fetching playlists with query:', playlistQuery);
  
    getPlaylistsByQuery(playlistQuery, this.spotifyToken, this.store.dispatch)
      .then(data => {
        if (!data || data.length === 0) {
          console.error('No playlists fetched.');
          return;
        }
        
        console.log('Fetched playlists data:', data);
  
        this.store.dispatch(setSpotifyPlaylistsAction(data));
        localStorage.setItem('spotifyPlaylists', JSON.stringify(data));
  
        console.log('Fetched Spotify playlists for query:', playlistQuery);
      })
      .catch(err => {
        console.error('Error fetching playlists:', err);
        this.handleSpotifyError(err);
      });
  };
  
  

  handleSpotifyError = (err: any) => {
    if (err.response) {
      err.response.json().then((errorData: any) => {
        console.error("Detailed Spotify Error:", errorData);
      });
    } else {
      console.error("Error:", err);
    }
  };

  hasValidToken = () => {
    const expiryTime = localStorage.getItem('tokenExpiryTime'); // get the stored expiry time
    if (!expiryTime) return false;
    console.log('EXPIRED?:', new Date().getTime() < parseInt(expiryTime, 10));
    return new Date().getTime() < parseInt(expiryTime, 10);
  };

  userIsLoggedIn = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  handleUserLogin = async (code: any) => {
    try {
      await getSpotifyAccessToken(code, this.store.dispatch);

      const spotifyToken = this.getSpotifyToken();

      if (spotifyToken) {
        const tokenExpiryTime = new Date().getTime() + (3600 * 1000);
        localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
        localStorage.setItem('isLoggedIn', 'true');
        fetchUserProfile(spotifyToken, this.store.dispatch);
        this.fetchSpotifyPlaylists();
        return this.spotifyToken;
      }
    } catch (error) {
      this.handleSpotifyError(error);
    }
    return null;
  };

  init() {
    this.fetchWeatherAndSunCalcData();
    if (!this.userIsLoggedIn() && !this.hasValidToken()) {
      this.handleUserLogin(this.code);
      this.fetchSpotifyPlaylists();
    }
    this.render();
  }

  fetchWeatherAndSunCalcData = async () => {
    const lat = 40.732542;
    const lon = -73.978773;
  
    try {
      const weatherData = await getWeatherByLocation(lat, lon);
      this.store.dispatch(setWeatherAction(weatherData));
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  
    try {
      const data = await getSunCalcData(lat, lon); // Correct order of lat and lon
      this.store.dispatch(setSunCalcAction(data));
    } catch (error) {
      console.error('Failed to fetch SunCalc data:', error);
    }
  };

  render() {
    const root = createRoot(document.getElementById('root') as HTMLElement);
    root.render(
    <Provider store={store}>
      <App updateMoodData={this.updateMoodData} />
    </Provider>);
  }
};