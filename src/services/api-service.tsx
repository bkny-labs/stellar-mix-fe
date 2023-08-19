import * as SunCalc from 'suncalc';

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT;
const REDIRECT_URI = "http://localhost:3000/browse"; 

export const getAuthURL = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID as string,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "user-read-private user-read-email user-read-currently-playing user-read-playback-state app-remote-control user-modify-playback-state",
    show_dialog: "true"
  });  

  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
};

export const getSpotifyAccessToken = async (code: string): Promise<string> => {
  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
  const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_SECRET; // You need this from your Spotify Dashboard

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
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
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

export const getPlaylistsByQuery = (query: string, token: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=10`;
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(API_ENDPOINT, { headers });
      const data = await response.json();
      resolve(data.playlists.items);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCurrentlyPlaying = async (accessToken: string) => {
  const API_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  const response = await fetch(API_ENDPOINT, { method: 'GET', headers: headers });
  
  if (!response.ok) {
    throw new Error('Failed to fetch current playback');
  }

  const data = await response.json();
  return {
    item: data.item,         // the track details
    isPlaying: data.is_playing  // playback status
  };
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

