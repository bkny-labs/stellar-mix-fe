import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile } from '../services/auth-service';
import { checkIfPlaylistIsFollowed, fetchPlaylistDetails, followPlaylist, getCurrentlyPlaying, pauseTrack, playNextTrack, playPreviousTrack, playTrack, setSpotifyVolume, toggleShufflePlayback, unfollowPlaylist } from '../services/spotify-service';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaHeart, FaRegHeart, FaInfoCircle } from 'react-icons/fa';
import { IoAlbums } from 'react-icons/io5';
import './SpotifyPlayer.css';
import { useDispatch } from 'react-redux';
import { Drawer } from './Drawer';
import { Track } from '../types/spotify.types';

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
  const [isShuffle, setIsShuffle] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(10);
  const [playlistId, setPlaylistId] = useState<any | null>(null);
  const [userId, setUserId] = useState<any | null>(null);
  const [playlistData, setPlaylistData] = useState<any | null>(null);
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

  const playlistDetails = useCallback(async () => {
    if (!playlistId) return;
    try {
      const playlistInfo = await fetchPlaylistDetails(playlistId, accessToken);
      console.log(playlistInfo);
      setPlaylistData(playlistInfo);
    } catch (error) {
      console.error('Failed to fetch playlist details:', error);
    }
  }, [playlistId, accessToken]);

  useEffect(() => {
    const interval = setInterval(updatePlaybackStatus, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [updatePlaybackStatus]);

  useEffect(() => {
    setTimeout(() => {
      playlistDetails()
      updatePlaybackStatus();
    }, 1000);
  }, [playlistDetails, playlistPlayed, updatePlaybackStatus]);

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

  const toggleShuffle = async () => {
    const newShuffleState = !isShuffle;
    await toggleShufflePlayback(accessToken, newShuffleState);
    setIsShuffle(newShuffleState);
  };

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
    if (!isDrawerOpen) {
      onDrawerToggle(true);
      updatePlaybackStatus();
    }
  };

  return (
    <>
    <div className="spotify-player">
      {currentTrack && (
        <div className="playback-info-container">
          <div className="track-info">
            <img src={currentTrack?.album.images[0].url} alt="album-cover" />
            <span>{currentTrack?.name}</span>
            <span className='artist'>{currentTrack?.artists[0].name}</span>
          </div>
          {playlistData &&
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a href='#' className='playlist' onClick={openDrawer}>from {playlistData?.name}</a>
              }
        </div>
      )}
      <div className="player-play">
          { isShuffle 
          ? <FaRandom onClick={toggleShuffle} color={'#fda53a'} size={25} />
          : <IoAlbums onClick={toggleShuffle} color={'#6f6f6f'} size={25} />
          }
          <FaStepBackward color={'#6f6f6f'} size={25} onClick={handlePreviousTrack} />
          {isPlaying 
              ? <FaPause color={'#aaa'} size={32} onClick={togglePlayPause} />
              : <FaPlay color={'#aaa'} size={32} onClick={togglePlayPause} />
          }
          <FaStepForward color={'#6f6f6f'} size={25} onClick={handleNextTrack} />
          { isFavorited 
            ? <FaHeart onClick={toggleFavorite} color={'#fda53a'} size={20} />
            : <FaRegHeart className='favorite' onClick={toggleFavorite} color={'#6f6f6f'} size={20} />
          }
      </div>

      <div className="player-controls">
        { isPlaying && (
          <button className='info-button' onClick={toggleDrawer}>
            <FaInfoCircle size={20} color={isDrawerOpen ? '#fda53a' : '#fff' } />
          </button>
        )}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={handleVolumeChange} 
        />
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
