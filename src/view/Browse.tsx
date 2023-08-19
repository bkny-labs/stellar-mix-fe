import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthURL, playSpotifyPlaylist } from '../services/api-service';
import { AppState } from '../model/state';
import { setSpotifyPlaylistsAction } from '../model/actions';
import { FaPlay, FaSpotify } from 'react-icons/fa';

const Browse: React.FC = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state: AppState) => state.spotifyPlaylists);
  const accessToken = useSelector((state: AppState) => state.spotifyToken);

  const playPlaylist = (playlistURI: string) => {
    if (accessToken) {
      playSpotifyPlaylist(playlistURI, accessToken);
      console.log("Playing playlist:", playlistURI);
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
      <div className="login">
        <button onClick={handleLogin}><FaSpotify /> Connect to Spotify</button>
      </div>
      <div className="row">
      {Array.isArray(playlists) && playlists.map((playlist: any) => (
        <div className="column" key={playlist.id}>
          <div 
            style={{
              width: '100%',
              paddingBottom: '100%',
              backgroundImage: `url(${playlist?.images?.[0]?.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <div className="controls">
            <button onClick={() => playPlaylist(playlist.uri)}>
              <FaPlay size={18} color='#fff' />
            </button>
            <h4 style={{fontSize: '14px'}}>{playlist?.name}</h4>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Browse;
