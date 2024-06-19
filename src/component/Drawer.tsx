/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile } from '../services/auth-service';
import { checkIfPlaylistIsFollowed, fetchPlaylistDetails, followPlaylist, playTrackInContext, unfollowPlaylist } from '../services/spotify-service';
import './SpotifyPlayer.css';
import { useDispatch } from 'react-redux';
import './Drawer.css';
import { AiOutlineCheck, AiOutlineCloseCircle } from 'react-icons/ai';
import SkeletonLoader from './SkeletonLoader';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaShareFromSquare } from 'react-icons/fa6';
import { Track } from '../types/spotify.types';
import { IoMdMusicalNotes } from "react-icons/io";

type DrawerProps = {
  accessToken: string;
  playlistPlayed: boolean;
  isVisible: boolean;
  toggleDrawer: () => void;
  onTrackChange: () => void;
  currentTrack: Track | null;
  playlistId: string | '';
  isPlaying: boolean;
};

export function Drawer({ accessToken, playlistPlayed, isVisible, toggleDrawer, onTrackChange, currentTrack, playlistId, isPlaying }: DrawerProps) {
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [playlistData, setPlaylistData] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const dispatch = useDispatch();

  const toggleFavorite = async () => {
    if (isFavorited) {
      await unfollowPlaylist(accessToken, playlistId);
      setIsFavorited(false);
    } else {
      await followPlaylist(accessToken, playlistId);
      setIsFavorited(true);
    }
  };

  const handleCopy = (spotifyLink: string) => {
    navigator.clipboard.writeText(spotifyLink).then(() => {
      setCopied(spotifyLink);
    }, () => {
      console.error('Failed to copy the link');
    });
  };

  const updateUserProfile = useCallback(async () => {
    try {
      const profile = await fetchUserProfile(accessToken, dispatch);
      setUserId(profile?.id);
      if (profile.id && playlistId) {
        const followStatus = await checkIfPlaylistIsFollowed(accessToken, playlistId, profile.id);
        setIsFavorited(followStatus);
      }
    } catch (error) {
      console.error("Error fetching user profile:", userId, error);
    }
  }, [accessToken, dispatch, playlistId]);

  const playlistDetails = useCallback(async () => {
    if (!playlistId) return;
    try {
      const playlistInfo = await fetchPlaylistDetails(playlistId, accessToken);
      setPlaylistData(playlistInfo);
    } catch (error) {
      console.error('Failed to fetch playlist details:', error);
      setIsLoading(false);
    }
  }, [playlistId, accessToken]);

  const playTrack = (track: any) => {
    playTrackInContext(accessToken, track.track.id, playlistId)
      .then(() => {
        onTrackChange();
      })
      .catch(error => {
        console.error("Error playing track:", error);
      });
  }

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      updateUserProfile(); // Fetch user profile and update follow status
      playlistDetails(); // Load the drawer content

      // Animate the drawer
      const drawerElem = document.querySelector('.drawer');
      setTimeout(() => {
        drawerElem?.classList.add('show');
      }, 100);
    } else {
      const drawerElem = document.querySelector('.drawer');
      drawerElem?.classList.remove('show');
    }
  }, [isVisible, playlistDetails, updateUserProfile]);

  useEffect(() => {
    if (playlistData) {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);  // 200ms delay, adjust as needed
    }
  }, [playlistData]);

  return isVisible ? (
    <div className="drawer">
      <div className="drawer-title">
        <h2><IoMdMusicalNotes /> Now Playing</h2>
        <button className='close-button' onClick={() => toggleDrawer()}>
          <AiOutlineCloseCircle size={20} />
        </button>
      </div>
  
      {isLoading ? (
        <div className="playlist-info skeleton">
          <SkeletonLoader width="100%" height="310px" marginBottom="12px" />
          <SkeletonLoader width="100%" height="22px" marginBottom="17px" />
          <SkeletonLoader width="100%" height="28px" marginBottom="17px" />
          <SkeletonLoader width="100%" height="330px" marginBottom="5px" />
        </div>
      ) : (
        <>
          {playlistData && (
            <>
              <div className="playlist-info">
                <img width="100%" src={playlistData?.images[0]?.url} alt="playlist-cover" />
                <div>
                  <span className='title'>{currentTrack?.name}</span>
                  <span className='artist'>{currentTrack?.artists[0].name}</span>
                </div>
                <h3>
                { isFavorited 
                    ? <FaHeart className='favorite' onClick={toggleFavorite} color={'var(--primary)'} size={20} />
                    : <FaRegHeart className='favorite' onClick={toggleFavorite} color={'#6f6f6f'} size={20} />
                  }
                  <a href={playlistData?.external_urls?.spotify || '#'} target='_blank' rel="noreferrer">
                    {playlistData?.name}
                  </a>
                  
                  {copied === playlistData?.external_urls?.spotify && <span className="copied-tooltip"><AiOutlineCheck /> Copied!</span>}
                  <button className='copy-button' onClick={() => handleCopy(playlistData?.external_urls?.spotify || '')}><FaShareFromSquare /></button>
                </h3>
                <p className='playlist-info-sm'>by: {playlistData?.owner.display_name}</p>
                <p className='playlist-info-sm'>{playlistData?.description}</p>
              </div>
  
              <div className="track-list">
                <table>
                  <thead>
                    <tr>
                      <th>Track</th>
                      <th></th>
                      {/* <th>Album</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {playlistData?.tracks?.items?.map((track: any) => (
                      <tr onClick={() => playTrack(track)} key={track?.track?.id} className={currentTrack?.id === track?.track?.id ? 'isPlaying' : ''}>
                        <td><img src={track?.track?.album.images[0].url} width="25px" alt="" /></td>
                        <td>
                        <span className='track-name'>{track?.track?.name}</span>
                        <span className='artist-name'>{track?.track?.artists.map((artist: any) => artist.name).join(', ')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  ) : null;
}
