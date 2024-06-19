import { setLoggedInAction } from "../store/actions";

export const getTopArtists = (token: string, dispatch: any, limit: string = '10'): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/artists?limit=${limit}`;
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(API_ENDPOINT, { headers });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(setLoggedInAction(false));
          localStorage.removeItem('isLoggedIn');
        }
        const errorData = await response.json();
        console.error("Spotify API Error Response:", errorData);
        reject(`Error ${response.status}: ${errorData.error.message}`);
        return;
      }

      const data = await response.json();
      resolve(data.artists);
    } catch (error) {
      console.error("Error fetching top artists:", error);
      reject(error);
    }
  });
};


// Get Playlist
export const getPlaylistsByQuery = (query: string, token: string, dispatch: any, limit: string = '50'): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=${limit}`;
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(API_ENDPOINT, { headers });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(setLoggedInAction(false));
          localStorage.removeItem('isLoggedIn');
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

export const getAvailableDevices = (token: string, dispatch: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const API_ENDPOINT = 'https://api.spotify.com/v1/me/player/devices';
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(API_ENDPOINT, { headers });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(setLoggedInAction(false));
          localStorage.removeItem('isLoggedIn');
        }
        const errorData = await response.json();
        console.error("Spotify API Error Response:", errorData);
        reject(`Error ${response.status}: ${errorData.error.message}`);
        return;
      }

      const data = await response.json();
      resolve(data.devices);
    } catch (error) {
      console.error("Error fetching available devices:", error);
      reject(error);
    }
  });
};

export const transferPlayback = (token: string, dispatch: any, deviceId: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const API_ENDPOINT = 'https://api.spotify.com/v1/me/player';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
      device_ids: [deviceId],
      play: true
    });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'PUT',
        headers,
        body
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(setLoggedInAction(false));
          localStorage.removeItem('isLoggedIn');
        }
        const errorData = await response.json();
        console.error("Spotify API Error Response:", errorData);
        reject(`Error ${response.status}: ${errorData.error.message}`);
        return;
      }

      resolve('Playback transferred successfully');
    } catch (error) {
      console.error("Error transferring playback:", error);
      reject(error);
    }
  });
};



  // Currently Playing
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
        localStorage.removeItem('isLoggedIn');
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
        isPlaying: data.is_playing,
        context: data.context // Adding the context object
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
  
  // Playlist Follow
  export const checkIfPlaylistIsFollowed = async (accessToken: string, playlistId: string, userId: string) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${userId}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };
  
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: headers,
    });
  
    const data = await response.json();
  
    return data[0];
  };

  export const getFavoritePlaylists = (token: string, dispatch: any, limit: string = '50'): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const API_ENDPOINT = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      try {
        const response = await fetch(API_ENDPOINT, { headers });

        if (!response.ok) {
          if (response.status === 401) {
            dispatch(setLoggedInAction(false));
            localStorage.removeItem('isLoggedIn');
          }
          const errorData = await response.json();
          console.error("Spotify API Error Response:", errorData);
          reject(`Error ${response.status}: ${errorData.error.message}`);
          return;
        }

        const data = await response.json();
        resolve(data.items);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        reject(error);
      }
    });
  };

  
  export const followPlaylist = async (accessToken: string, playlistId: string) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'PUT',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Error following playlist: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const unfollowPlaylist = async (accessToken: string, playlistId: string) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };
  
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'DELETE',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Error unfollowing playlist: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  
  // Playback Controls
  export const toggleShufflePlayback = async (accessToken: any, state: boolean) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/me/player/shuffle?state=${state}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  
    return fetch(API_ENDPOINT, {
      method: 'PUT',
      headers: headers,
    });
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

  export const playTrackInContext = async (accessToken: string, trackId: string, playlistId: string) => {
    const API_ENDPOINT = `https://api.spotify.com/v1/me/player/play`;
  
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  
    const body = {
      context_uri: `spotify:playlist:${playlistId}`, // This specifies the context (in this case, a playlist)
      offset: {
        uri: `spotify:track:${trackId}` // This specifies which track to start with
      }
    };
  
    return fetch(API_ENDPOINT, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body)
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
  
  // Volume Controls
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
  
  // Play Spotify Playlist
  export const playSpotifyPlaylist = async (playlistURI: string, accessToken: string) => {
    const getActiveDevices = async () => {
        const DEVICES_ENDPOINT = `https://api.spotify.com/v1/me/player/devices`;
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
  
        const response = await fetch(DEVICES_ENDPOINT, { method: 'GET', headers: headers });
        const data = await response.json();
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
  
  // Genres
  export const fetchAvailableGenres = async (token: string): Promise<string[] | null> => {
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

  export const fetchPlaylistDetails = (playlistId: string, accessToken: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}`;
  
      fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
    });
  }
  