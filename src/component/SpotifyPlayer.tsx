import { useState, useEffect } from 'react';
import { getCurrentlyPlaying, pauseTrack, playTrack, setSpotifyVolume } from '../services/api-service';
import { FaPlay, FaPause } from 'react-icons/fa';
import './SpotifyPlayer.css';

type Artist = {
    name: string;
    // add other fields you need
  };
  
  type Album = {
    images: { url: string }[];
    // add other fields you need
  };
  
  type Track = {
    name: string;
    album: Album;
    artists: Artist[];
    // add other fields you need
  };

  type SpotifyPlayerProps = {
    accessToken: string;
    playlistPlayed: boolean;
  };

export function SpotifyPlayer({ accessToken, playlistPlayed }: SpotifyPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(10);

  const updatePlaybackStatus = () => {
    getCurrentlyPlaying(accessToken).then(data => {
      setCurrentTrack(data.item);
      setIsPlaying(data.isPlaying);
    }).catch(error => {
      console.error("Error fetching current playback:", error);
    });
  };

  const togglePlayPause = () => {
    const action = isPlaying ? pauseTrack : playTrack;
    action(accessToken)
      .then(updatePlaybackStatus)
      .catch(error => {
        console.error(`Error ${isPlaying ? 'pausing' : 'playing'} track:`, error);
      });
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
  
    // Now, update the Spotify volume using the new function
    setSpotifyVolume(accessToken, newVolume).catch(error => {
      console.error("Failed to change volume:", error);
    });
  };
  
  

  useEffect(() => {
    updatePlaybackStatus();
  }, [accessToken, playlistPlayed]);
  

  if (!currentTrack) return null;

  return (
    <div className="spotify-player">
      <div className="track-info">
        <img src={currentTrack.album.images[0].url} alt="album-cover" />
        <span>{currentTrack.name}</span>
        <span>{currentTrack.artists[0].name}</span>
      </div>
      <div className="player-play">
          {isPlaying 
                ? <FaPause color={'#6f6f6f'} size={50} onClick={togglePlayPause} />
                : <FaPlay color={'#6f6f6f'} size={50} onClick={togglePlayPause} />
            }
      </div>
      <div className="player-controls">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={handleVolumeChange} 
        />
      </div>
    </div>
  );
}
