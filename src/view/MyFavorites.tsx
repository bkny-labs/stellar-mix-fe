// components/Favorites.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaPause, FaPlay } from 'react-icons/fa';
import './Browse.css';
import { getFavoritePlaylists, playSpotifyPlaylist } from '../services/spotify-service';
import SpaceBackground from '../component/Space';
import SkeletonLoader from '../component/SkeletonLoader';
import { SpotifyPlayer } from '../component/SpotifyPlayer';
import album from '../assets/album.png';

const MyFavorites: React.FC = () => {
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);
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
    const fetchFavoritePlaylists = async () => {
      try {
        if (accessToken) {
          const data = await getFavoritePlaylists(accessToken, dispatch);
          setFavorites(data);
          setIsLoading(false);
        } else {
          console.error("Access token is not available.");
        }
      } catch (error) {
        console.error("Error fetching favorite playlists:", error);
        setIsLoading(false);
      }
    };

    fetchFavoritePlaylists();
  }, [dispatch, accessToken]);

  return (
    <>
      <div className="space-background">
        <SpaceBackground />
      </div>

      <div className='browse-grid'>
        <div className={isDrawerOpen ? 'row three drawer-open' : 'row four'}>
          {isLoading ? (
            Array(10).fill(0).map((_, index) => (
              <div className="column" key={index}>
                <SkeletonLoader width="250px" height="250px" marginBottom="15px" />
              </div>
            ))
          ) : (
            favorites.map((playlist: any) => (
              <div className="column" key={playlist.id}>
                <div 
                  className={`album-art ${currentlyPlayingURI === playlist.uri ? 'currently-playing' : ''}`}
                  style={{
                    backgroundImage: `url(${playlist?.images?.[0]?.url || album})`,
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
              </div>
            ))
          )}
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

export default MyFavorites;
