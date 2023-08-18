import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthURL } from '../services/api-service';
import { AppState } from '../model/state';
import { setSpotifyPlaylistsAction } from '../model/actions'; // Import this action if not done already

const Spotify: React.FC = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state: AppState) => state.spotifyPlaylists);

  useEffect(() => {
    // On component load, check localStorage
    const storedPlaylists = localStorage.getItem('spotifyPlaylists');
    if (storedPlaylists) {
      // If playlists exist in localStorage, dispatch them to Redux
      dispatch(setSpotifyPlaylistsAction(JSON.parse(storedPlaylists)));
    }
  }, [dispatch]);

  useEffect(() => {
    // When playlists change, update localStorage
    if (Array.isArray(playlists)) {
      localStorage.setItem('spotifyPlaylists', JSON.stringify(playlists));
    }
  }, [playlists]);

  const handleLogin = () => {
    window.location.href = getAuthURL();
  }

  return (
    <div>
      {Array.isArray(playlists) && playlists.map((playlist: any) => (
        <div key={playlist.id}>
          <h3>{playlist?.name}</h3>
          <img src={playlist?.images?.[0]?.url} alt={playlist?.name || 'Spotify Playlist'} width={100} />
          <p>{playlist?.description}</p>
        </div>
      ))}
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Spotify;
