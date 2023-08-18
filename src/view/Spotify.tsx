import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';  
import { setLoggedInAction, setSpotifyPlaylistsAction } from '../model/actions';
import { getAccessToken, getAuthURL, getPlaylistsByQuery } from '../services/api-service';

const Spotify: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const query = '70s funk';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
  
    if (code) {
      getAccessToken(code)
        .then(accessToken => {
          // Store the access token in the state
          dispatch(setLoggedInAction(true, accessToken));
  
          // Fetch the playlists when the token is available
          return getPlaylistsByQuery(query, accessToken);
        })
        .then(data => {
          // Dispatch the playlists to the Redux store
          dispatch(setSpotifyPlaylistsAction(data));
          // If you also want to store the playlists in local component state
          setPlaylists(data);
        })
        .catch(err => console.error("Error:", err));
    }
  }, [dispatch, location.search]);



  const handleLogin = () => {
    window.location.href = getAuthURL();
  }

  return (
    <div>
      <div>Spotify view here!</div>
      {playlists.map(playlist => (
        <div key={playlist.id}>
          <h3>{playlist.name}</h3>
          <img src={playlist.images[0]?.url} alt={playlist.name} width={100} />
          <p>{playlist.description}</p>
        </div>
      ))}
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Spotify;
