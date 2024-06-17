import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { playSpotifyPlaylist } from '../services/spotify-service';
import { AppState } from '../store/state';
import { setSpotifyPlaylistsAction } from '../store/actions';
import { FaPause, FaPlay } from 'react-icons/fa';
import { SpotifyPlayer } from '../component/SpotifyPlayer';
import SpaceBackground from '../component/Space';
import './Browse.css';
import SkeletonLoader from '../component/SkeletonLoader';

const Browse: React.FC = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state: AppState) => state.spotifyPlaylists);
  const accessToken = localStorage.getItem('spotifyToken');
  const [playlistPlayed, setPlaylistPlayed] = useState(false);
  const [currentlyPlayingURI, setCurrentlyPlayingURI] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const playPlaylist = (playlistURI: string) => {
    if (accessToken) {
      if (!isDrawerOpen) {
        setIsDrawerOpen(true);
      }
      playSpotifyPlaylist(playlistURI, accessToken)
        .then(() => {
          setPlaylistPlayed(prevPlayed => !prevPlayed);
          console.log("Playing playlist:", playlistURI);
          if (currentlyPlayingURI === playlistURI) {
            setCurrentlyPlayingURI(null);
          } else {
            setCurrentlyPlayingURI(playlistURI);
          }
        })
        .catch(error => {
          console.error("Error playing playlist:", error);
        });
    } else {
      console.error("Access token is not available.");
    }
  };
  
  const handleDrawerToggle = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  useEffect(() => {
    const storedPlaylists = localStorage.getItem('spotifyPlaylists');
    if (storedPlaylists) {
      dispatch(setSpotifyPlaylistsAction(JSON.parse(storedPlaylists)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(playlists)) {
      localStorage.setItem('spotifyPlaylists', JSON.stringify(playlists));
      setIsLoading(false);
    }
  }, [playlists]);

  return (
    <>
    <div className="space-background">
      <SpaceBackground />
    </div>

    <div className='browse-grid'>
      <div className={isDrawerOpen ? 'row three drawer-open' : 'row four'}>
      {Array.isArray(playlists) && playlists.map((playlist: any) => (
        <div className="column" key={playlist.id}>
          {isLoading ? (
            <>
                <SkeletonLoader width="310px" height="310px" marginBottom="15px" />
            </>
          ) : (
          <div 
            className={`album-art ${currentlyPlayingURI === playlist.uri ? 'currently-playing' : ''}`}
            style={{
              backgroundImage: `url(${playlist?.images?.[0]?.url})`,
            }}
          >
            <div className="playback-controls">
                <button className='play-circle' onClick={() => playPlaylist(playlist.uri)}>
                  {currentlyPlayingURI === playlist.uri
                    ? <FaPause size={25} color='#202020' />
                    : <FaPlay size={25} color='#202020' />
                  }
                </button>
                <h2 className='playlist-title'>{playlist?.name}</h2>
            </div>
          </div>
          )}
        </div>
      ))}
      </div>
      {accessToken && 
        <SpotifyPlayer 
          key={currentlyPlayingURI} 
          accessToken={accessToken} 
          isDrawerOpen={isDrawerOpen}
          playlistPlayed={playlistPlayed} 
          onDrawerToggle={handleDrawerToggle}
          currentlyPlayingURI={currentlyPlayingURI}
          setCurrentlyPlayingURI={setCurrentlyPlayingURI}
      />}
    </div>
    </>
  );
};

export default Browse;
