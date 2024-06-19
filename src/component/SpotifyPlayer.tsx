import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile } from '../services/auth-service';
import { checkIfPlaylistIsFollowed, followPlaylist, getCurrentlyPlaying, pauseTrack, playNextTrack, playPreviousTrack, playTrack, setSpotifyVolume, unfollowPlaylist } from '../services/spotify-service';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart, FaRegHeart, FaInfoCircle, FaVolumeUp } from 'react-icons/fa';
import './SpotifyPlayer.css';
import { useDispatch } from 'react-redux';
import { Drawer } from './Drawer';
import { Track } from '../types/spotify.types';
import DeviceSelect from './DeviceSelect';

type SpotifyPlayerProps = {
  accessToken: string;
  playlistPlayed: boolean;
  onDrawerToggle: any;
  isDrawerOpen: boolean;
  currentlyPlayingURI: string | null;
  setCurrentlyPlayingURI: (uri: string | null) => void;
};

export function SpotifyPlayer({ accessToken, playlistPlayed, onDrawerToggle, isDrawerOpen, currentlyPlayingURI, setCurrentlyPlayingURI }: SpotifyPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  // const [isShuffle, setIsShuffle] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(10);
  const [playlistId, setPlaylistId] = useState<any | null>(null);
  const [userId, setUserId] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileVolume , setMobileVolume] = useState(false);
  const dispatch = useDispatch();
  const POLLING_INTERVAL = 5000;

  const updatePlaybackStatus = useCallback(() => {
    getCurrentlyPlaying(accessToken, dispatch).then(data => {
      if (data && data.item) {
        setCurrentTrack(data.item);
        setIsPlaying(data.isPlaying);
        if (data.context && data.context.type === 'playlist') {
          const currentPlaylistId = data.context.uri.split(':').pop();
          setPlaylistId(currentPlaylistId);
          if (data.context.uri !== currentlyPlayingURI) {
            setCurrentlyPlayingURI(data.context.uri);
          }
        } else {
          setPlaylistId(null);
        }
      } else {
        setCurrentTrack(null);
        setIsPlaying(false);
        setPlaylistId(null);
        setCurrentlyPlayingURI(null);
      }
    }).catch(error => {
      console.error("Error fetching current playback:", error);
    });

    fetchUserProfile(accessToken, dispatch).then(data => {
      if (data) {
        setUserId(data.id);
      }
    }).catch(error => {
      console.error("Error fetching user profile:", error);
    });
  }, [accessToken, dispatch, currentlyPlayingURI, setCurrentlyPlayingURI]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileVolume(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const interval = setInterval(updatePlaybackStatus, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [updatePlaybackStatus]);

  useEffect(() => {
    setTimeout(() => {
      updatePlaybackStatus();
    }, 1000);
  }, [playlistPlayed, updatePlaybackStatus]);

  useEffect(() => {
    if (userId && playlistId) {
      checkIfPlaylistIsFollowed(accessToken, playlistId, userId)
        .then(followStatus => setIsFavorited(followStatus));
    }
  }, [userId, playlistId, accessToken]);

  const toggleFavorite = async () => {
    if (isFavorited) {
      await unfollowPlaylist(accessToken, playlistId);
      setIsFavorited(false);
    } else {
      await followPlaylist(accessToken, playlistId);
      setIsFavorited(true);
    }
  };

  const togglePlayPause = () => {
    const action = isPlaying ? pauseTrack : playTrack;
    action(accessToken)
      .then(updatePlaybackStatus)
      .catch(error => {
        console.error(`Error ${isPlaying ? 'pausing' : 'playing'} track:`, error);
      });
  };

  // const toggleShuffle = async () => {
  //   const newShuffleState = !isShuffle;
  //   await toggleShufflePlayback(accessToken, newShuffleState);
  //   setIsShuffle(newShuffleState);
  // };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    setSpotifyVolume(accessToken, newVolume).catch(error => {
      console.error("Failed to change volume:", error);
    });
  };

  const handleNextTrack = () => {
    playNextTrack(accessToken)
      .then(updatePlaybackStatus)
      .catch(error => {
        console.error("Error playing the next track:", error);
      });
  };

  const handlePreviousTrack = () => {
    playPreviousTrack(accessToken)
      .then(updatePlaybackStatus)
      .catch(error => {
        console.error("Error playing the previous track:", error);
      });
  };

  const toggleDrawer = () => {
    onDrawerToggle(!isDrawerOpen);
    if (!isDrawerOpen) {
      updatePlaybackStatus();
    }
  };

  const openDrawer = () => {
    onDrawerToggle(!isDrawerOpen);
    if (!isDrawerOpen) {
      updatePlaybackStatus();
    }
  };

  const handleMobileVolume = () => {
    setMobileVolume(!mobileVolume)
  }

  return (
    <>
    <div className="spotify-player">
      {currentTrack && (
        <div className="track-info">
          <img onClick={openDrawer} src={currentTrack?.album.images[0].url} alt="album-cover" />
          <div className='name'>
            <span className='title'>{currentTrack?.name}</span>
            <span className='artist'>{currentTrack?.artists[0].name}</span>
          </div>
        </div>
      )}
      <div className="player-play">
          {/* { isShuffle 
          ? <FaRandom onClick={toggleShuffle} color={'var(--primary)'} size={25} />
          : <IoAlbums onClick={toggleShuffle} color={'#6f6f6f'} size={25} />
          } */}
          <DeviceSelect token={accessToken} dispatch={dispatch} />
          <FaStepBackward color={'#6f6f6f'} size={25} onClick={handlePreviousTrack} />
          {isPlaying 
              ? <FaPause color={'#aaa'} size={32} onClick={togglePlayPause} />
              : <FaPlay color={'#aaa'} size={32} onClick={togglePlayPause} />
          }
          <FaStepForward color={'#6f6f6f'} size={25} onClick={handleNextTrack} />
          { isFavorited 
            ? <FaHeart onClick={toggleFavorite} color={'var(--primary)'} size={20} />
            : <FaRegHeart className='favorite' onClick={toggleFavorite} color={'#6f6f6f'} size={20} />
          }
      </div>

      <div className="player-controls">
          <button className='info-button' onClick={toggleDrawer}>
            <FaInfoCircle size={20} color={isDrawerOpen ? 'var(--primary)' : '#fff' } />
          </button>
        {
          isMobile &&
          <button onClick={handleMobileVolume}>
            <FaVolumeUp size={24} color={mobileVolume ? '#fff' : "#6f6f6f"} />
          </button>
        }
        { mobileVolume && isMobile &&
          <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={handleVolumeChange} 
          className='vertical'
        />
        }
        { !mobileVolume && !isMobile &&
          <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={handleVolumeChange} 
        />
        }
      </div>
    </div>
    {isDrawerOpen && 
      <Drawer 
        toggleDrawer={toggleDrawer} 
        isVisible={isDrawerOpen} 
        accessToken={accessToken} 
        playlistPlayed={playlistPlayed} 
        onTrackChange={updatePlaybackStatus} 
        currentTrack={currentTrack}
        playlistId={playlistId}
        isPlaying={isPlaying}
      />}
    </>
  );
}
