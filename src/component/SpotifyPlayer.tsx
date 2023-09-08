import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile } from '../services/auth-service';
import { checkIfPlaylistIsFollowed, followPlaylist, getCurrentlyPlaying, pauseTrack, playNextTrack, playPreviousTrack, playTrack, setSpotifyVolume, toggleShufflePlayback, unfollowPlaylist } from '../services/spotify-service';
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
};

export function SpotifyPlayer({ accessToken, playlistPlayed, onDrawerToggle, isDrawerOpen }: SpotifyPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(10);
  const [playlistId, setPlaylistId] = useState<any | null>(null);
  const [userId, setUserId] = useState<any | null>(null);
  const dispatch = useDispatch();

  const handleTrackChangeFromDrawer = () => {
    updatePlaybackStatus();
  };

  const updatePlaybackStatus = useCallback(() => {
    // Fetch the current playback track and set playlistId
    getCurrentlyPlaying(accessToken, dispatch).then(data => {
      setCurrentTrack(data.item);
      setIsPlaying(data.isPlaying);
  
      // If the song is being played from a playlist, extract the playlist ID
      if (data.item?.context?.type === 'playlist') {
        const currentPlaylistId = data.item.context.uri.split(':').pop();
        setPlaylistId(currentPlaylistId);
      } else {
        setPlaylistId(null);
      }
    }).catch(error => {
      console.error("Error fetching current playback:", error);
    });
  
    // Fetch the user profile and set userId
    fetchUserProfile(accessToken, dispatch).then(data => {
      if (data) {
        setUserId(data.id);
      }
    }).catch(error => {
      console.error("Error fetching user profile:", error);
    });
  
    if (playlistId) {
      checkIfPlaylistIsFollowed(accessToken, playlistId, userId)
        .then(followStatus => setIsFavorited(followStatus));
    }

  }, [accessToken, dispatch, playlistId, userId]);

  const toggleFavorite = async () => {
    if (isFavorited) {
      unfollowPlaylist(accessToken, playlistId);
      setIsFavorited(false);
    } else {
      followPlaylist(accessToken, playlistId);
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
    const newShuffleState = !isShuffle; // Flip the current state
    toggleShufflePlayback(accessToken, newShuffleState);
    setIsShuffle(newShuffleState); // Update the local state
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
      .then(() => {
        getCurrentlyPlaying(accessToken, dispatch).then(data => {
          setCurrentTrack(data.item);
          setIsPlaying(data.isPlaying);
        });
      })
      .catch(error => {
        console.error("Error playing the next track:", error);
      });
  };

  const handlePreviousTrack = () => {
    playPreviousTrack(accessToken)
      .then(() => {
        getCurrentlyPlaying(accessToken, dispatch).then(data => {
          setCurrentTrack(data.item);
          setIsPlaying(data.isPlaying);
        });
      })
      .catch(error => {
        console.error("Error playing the previous track:", error);
      });
  };

  const toggleDrawer = () => {
    onDrawerToggle(!isDrawerOpen);
  };

  useEffect(() => {
    updatePlaybackStatus();
  }, [playlistPlayed, setCurrentTrack, isPlaying, updatePlaybackStatus]);

  useEffect(() => {
    if (userId && playlistId) {
      checkIfPlaylistIsFollowed(accessToken, playlistId, userId)
        .then(followStatus => setIsFavorited(followStatus));
    }
  }, [userId, playlistId, accessToken]);

  return (
    <>
    <div className="spotify-player">
      {currentTrack && (
      <div className="track-info">
        <img src={currentTrack?.album.images[0].url} alt="album-cover" />
        <span>{currentTrack?.name}</span>
        <span>{currentTrack?.artists[0].name}</span>
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
            : <FaRegHeart onClick={toggleFavorite} color={'#6f6f6f'} size={20} />
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
        onTrackChange={handleTrackChangeFromDrawer} 
      />}
    </>
    
  );
}
