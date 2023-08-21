import * as SunCalc from 'suncalc';
import { setLoggedInAction } from '../model/actions';

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_SECRET;
const REDIRECT_URI = "http://localhost:3000/browse"; 

export const getAuthURL = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID as string,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "user-read-private user-read-email user-read-currently-playing user-read-playback-state app-remote-control user-modify-playback-state",
    // show_dialog: "true"
  });  
  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
};

export const getSpotifyAccessToken = async (code: string, dispatch: any): Promise<string> => {
  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("code", code);
  body.append("redirect_uri", REDIRECT_URI);
  body.append("client_id", CLIENT_ID as string);
  body.append("client_secret", CLIENT_SECRET as string); 

  const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Spotify API Error Response:", errorData);
    dispatch(setLoggedInAction(false));
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  // Set the token in localStorage immediately after obtaining it
  localStorage.setItem('spotifyToken', data.access_token);

  return data.access_token;
};

export const fetchUserProfile = async (accessToken: string, dispatch: any) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    dispatch(setLoggedInAction(false));
    throw new Error('Failed to fetch user profile');
  }

  const data = await response.json();
  return data;
};

export const getWeatherByLocation = (lat: number, long: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const API_KEY = '868555d60c85896c6af99f0e8e6b8f12';
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.cod !== 200) { // Check for error
        reject(data.message);
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getPlaylistsByQuery = (query: string, token: string, dispatch: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=20`;
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(API_ENDPOINT, { headers });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(setLoggedInAction(false));
        }
        const errorData = await response.json();
        console.error("Spotify API Error Response:", errorData);
        reject(`Error ${response.status}: ${errorData.error.message}`);
        return;
      }

      const data = await response.json();
      resolve(data.playlists.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      reject(error);
    }
  });
};

export const getCurrentlyPlaying = async (accessToken: string, dispatch: any) => {
  const API_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing?market=US`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept-Language': 'en-US'
  };

  try {
    const response = await fetch(API_ENDPOINT, { method: 'GET', headers: headers });

    if (response.status === 204) {
        return { status: 'no-track-playing' };
    }

    if (!response.ok) {
      dispatch(setLoggedInAction(false));
      throw new Error(`Failed to fetch current playback: ${response.statusText}`);
    }

    let data;
    try {
        data = await response.json();
    } catch (parseError) {
        console.warn('Failed to parse response. The response might be empty.');
        return { status: 'no-data' };
    }

    return {
      status: 'success',
      item: data.item,
      isPlaying: data.is_playing
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching currently playing track:", error.message);
      return { status: 'error', message: error.message };
    } else {
      console.error("An unexpected error occurred:", error);
      return { status: 'error', message: 'An unexpected error occurred.' };
    }
  }
};

export const playTrack = async (accessToken: string) => {
  const API_ENDPOINT = `https://api.spotify.com/v1/me/player/play`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  return fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: headers,
  });
};

export const pauseTrack = async (accessToken: string) => {
  const API_ENDPOINT = `https://api.spotify.com/v1/me/player/pause`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  return fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: headers,
  });
};

// Move to next track
export const playNextTrack = async (accessToken: string) => {
  const endpoint = 'https://api.spotify.com/v1/me/player/next';

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`Failed to skip to the next track. Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error playing the next track:", error);
    throw error;
  }
};

// Move to previous track
export const playPreviousTrack = async (accessToken: string) => {
  const endpoint = 'https://api.spotify.com/v1/me/player/previous';

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`Failed to skip to the previous track. Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error playing the previous track:", error);
    throw error;
  }
};


export const setSpotifyVolume = async (accessToken: string, volume: number) => {
  const endpoint = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  headers.append('Content-Type', 'application/json');

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`Failed to set volume. Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error setting volume:", error);
    throw error;
  }
};

export const getSunCalcData = (lat: number, long: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const sunTimes = SunCalc.getTimes(new Date(), lat, long);
      const moonIllumination = SunCalc.getMoonIllumination(new Date());
      const data = {
        sunrise: sunTimes.sunrise.toISOString(),
        sunset: sunTimes.sunset.toISOString(),
        moonPhase: moonIllumination.phase
        // ... any other data you want
      };

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const playSpotifyPlaylist = async (playlistURI: string, accessToken: string) => {
  const getActiveDevices = async () => {
      const DEVICES_ENDPOINT = `https://api.spotify.com/v1/me/player/devices`;
      const headers = {
          'Authorization': `Bearer ${accessToken}`
      };

      const response = await fetch(DEVICES_ENDPOINT, { method: 'GET', headers: headers });
      const data = await response.json();
      console.log("Active devices:", data.devices);
      return data.devices;
  };

  const API_ENDPOINT = `https://api.spotify.com/v1/me/player/play`;
  const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
  };

  const devices = await getActiveDevices();
  if (!devices.length) {
      throw new Error("No active devices found.");
  }

  // This will get the ID of the first active device. You can refine this if needed.
  const deviceId = devices[0].id; 

  const body = {
      context_uri: playlistURI
  };

  try {
      const response = await fetch(API_ENDPOINT + `?device_id=${deviceId}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(body)
      });

      if (response.status === 204) {
          return;  // Playback started successfully
      } else if (response.status === 403) {
          throw new Error('User may not have a premium account or permissions are missing.');
      } else if (response.status === 404) {
          throw new Error('No active devices found. Please start playback on a device.');
      } else {
          const data = await response.json();
          throw new Error(data.error.message);
      }
  } catch (error) {
      console.error("Error starting playback:", error);
      throw error;  // Re-throw to be caught by the caller if needed
  }
};

export const  fetchAvailableGenres = async (token: string): Promise<string[] | null> => {
  const endpoint = "https://api.spotify.com/v1/recommendations/available-genre-seeds";
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(endpoint, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();

    // Assuming that the API returns the genres in an object with a key named 'genres'.
    return data.genres;
  } catch (error) {
    console.error("Error fetching available genres:", error);
    return null;
  }
}
