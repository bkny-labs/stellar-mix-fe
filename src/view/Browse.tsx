import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthURL, playSpotifyPlaylist } from '../services/api-service';
import { AppState } from '../model/state';
import { setSpotifyPlaylistsAction } from '../model/actions'; // Import this action if not done already

const Browse: React.FC = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state: AppState) => state.spotifyPlaylists);
  const accessToken = useSelector((state: AppState) => state.spotifyToken);

  const playPlaylist = (playlistURI: string) => {
    if (accessToken) {
      playSpotifyPlaylist(playlistURI, accessToken);
      console.log("Playing playlist:", playlistURI);
      console.log("Access Token is:", accessToken);
    } else {
      console.error("Access token is not available.");
    }
  }

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
      <button onClick={handleLogin}>Login with Spotify</button>
      {Array.isArray(playlists) && playlists.map((playlist: any) => (
        <div key={playlist.id}>
          <h3>{playlist?.name}</h3>
          <img src={playlist?.images?.[0]?.url} alt={playlist?.name || 'Spotify Playlist'} width={100} />
          <p>{playlist?.description}</p>
          <button onClick={() => playPlaylist(playlist.uri)}>Play</button>
        </div>
      ))}
    </div>
  );
};

export default Browse;
