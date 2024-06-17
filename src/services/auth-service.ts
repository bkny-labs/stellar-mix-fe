import { setLoggedInAction } from '../store/actions';

// Spotify Authentication
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_SECRET;

const REDIRECT_URI = process.env.REACT_APP_URL + "/browse"; 

export const getAuthURL = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID as string,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "user-read-private user-read-email user-read-currently-playing user-read-playback-state app-remote-control user-modify-playback-state playlist-modify-public playlist-modify-private",
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
    localStorage.setItem('isLoggedIn', 'false');
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  // Set the token in localStorage immediately after obtaining it
  localStorage.setItem('spotifyToken', data.access_token);
  localStorage.setItem('isLoggedIn', 'true');
  dispatch(setLoggedInAction(true, data.access_token));

  return data.access_token;
};

export const logout = (dispatch: any) => {
  localStorage.removeItem('spotifyToken');
  localStorage.removeItem('tokenExpiryTime');
  localStorage.removeItem('isLoggedIn');
  dispatch(setLoggedInAction(false));
  window.location.href = '/';
}

export const fetchUserProfile = async (accessToken: string, dispatch: any) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      dispatch(setLoggedInAction(false));
      localStorage.removeItem('isLoggedIn');
      throw new Error('Failed to fetch user profile');
    }
    const data = await response.json();
    console.log("LOGGED IN", data);
    localStorage.setItem('isLoggedIn', 'true');
    return data;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};




