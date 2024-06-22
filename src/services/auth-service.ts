import { setLoggedInAction } from '../store/actions';

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_SECRET;
const REDIRECT_URI = process.env.REACT_APP_URL + "/browse"; 

const handleError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Spotify API Error:', errorData);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response;
};

export const getClientCredentialsToken = async (): Promise<string> => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');

  const headers = new Headers();
  headers.append(
    'Authorization',
    'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
  );
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: headers,
    body: body.toString(),
  });

  const data = await handleError(response).then(res => res.json());
  return data.access_token;
};

export const getAuthURL = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID as string,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "user-read-private user-read-email user-read-currently-playing user-read-playback-state app-remote-control user-modify-playback-state playlist-modify-public playlist-modify-private",
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
    const errorText = await response.text();
    console.error('Failed to fetch access token:', errorText);
    throw new Error('Failed to fetch access token');
  }

  const data = await response.json();

  console.log('Received token data:', data);

  const tokenExpiryTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem('spotifyToken', data.access_token);
  localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
  localStorage.setItem('isLoggedIn', 'true');

  dispatch(setLoggedInAction(true, data.access_token));

  return data.access_token;
};



export const logout = (dispatch: any) => {
  localStorage.removeItem('spotifyToken');
  localStorage.removeItem('tokenExpiryTime');
  localStorage.removeItem('isLoggedIn');
  dispatch(setLoggedInAction(false));
}

export const fetchUserProfile = async (accessToken: string, dispatch: any) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 403) {
      console.error('Token expired or invalid.');
      logout(dispatch);
      return null;
    }

    await handleError(response);

    const data = await response.json();
    localStorage.setItem('isLoggedIn', 'true');
    return data;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    dispatch(setLoggedInAction(false));
    localStorage.removeItem('isLoggedIn');
    return null;
  }
};
