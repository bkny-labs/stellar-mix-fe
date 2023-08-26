import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile } from '../services/auth-service';
import { checkIfPlaylistIsFollowed, fetchPlaylistDetails, getCurrentlyPlaying } from '../services/spotify-service';
import './SpotifyPlayer.css';
import { useDispatch } from 'react-redux';
import './Drawer.css'
import { AiOutlineCloseCircle } from 'react-icons/ai';

type DrawerProps = {
  accessToken: any;
  playlistPlayed: boolean;
  isVisible: boolean;
  toggleDrawer: any;
};

export function Drawer({ accessToken, playlistPlayed, isVisible, toggleDrawer }: DrawerProps) {
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [playlistId, setPlaylistId] = useState<any | null>(null);
  const [playlistData, setPlaylistData] = useState<any | null>(null);
  const [userId, setUserId] = useState<any | null>(null);
  const dispatch = useDispatch();

  const updatePlaybackStatus = useCallback(async () => {
    try {
      const playbackData = await getCurrentlyPlaying(accessToken, dispatch);
      
      if (playbackData?.context?.type === 'playlist') {
        const currentPlaylistId = playbackData.context.uri.split(':').pop();
        setPlaylistId(currentPlaylistId);
        
        const profile = await fetchUserProfile(accessToken, dispatch);
        setUserId(profile?.id);

        if (profile?.id) {
          const followStatus = await checkIfPlaylistIsFollowed(accessToken, currentPlaylistId, profile.id);
          setIsFavorited(followStatus);
        }
      } else {
        setPlaylistId(null);
      }
    } catch (error) {
      console.error("Error fetching playback or user profile:", error);
    }
  }, [accessToken, dispatch]);

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
    if (isVisible) {
        // Animate the drawer
        const drawerElem = document.querySelector('.drawer');
        setTimeout(() => {
            drawerElem?.classList.add('show');
        }, 100); 

        // Load the drawer content
        playlistDetails();
    } else {
        const drawerElem = document.querySelector('.drawer');
        drawerElem?.classList.remove('show');
    }
}, [isVisible, playlistDetails]);


  useEffect(() => {
    updatePlaybackStatus();
  }, [playlistPlayed, updatePlaybackStatus]);

  return isVisible ? (
    <>
    <div className="drawer">
      <div className="drawer-title">
        <h2>Now Playing</h2>
        <button className='close-button' onClick={() => toggleDrawer(false)}>
          <AiOutlineCloseCircle size={20} />
        </button>
      </div>
      {playlistData && (
        <>
        <div className="playlist-info">
          <img width="100%" src={playlistData?.images[0].url} alt="playlist-cover" />
          <h3><a href={playlistData?.external_urls.spotify} target='_blank' rel="noreferrer">{playlistData?.name}</a></h3>
          <p className='playlist-info-sm'>by: {playlistData?.owner.display_name}</p>
          <p className='playlist-info-sm'>{playlistData?.description}</p>
        </div>
        <div className="track-list">
          <table>
            <thead>
              <tr>
                <th>Track</th>
                <th></th> {/* Column for play buttons */}
                <th>Artist</th>
                <th>Album</th>
              </tr>
            </thead>
            <tbody>
              {playlistData?.tracks.items.map((track: any) => (
                <tr key={track.track.id} className={track.isPlaying ? 'isPlaying' : ''}>
                  <td><img src={track.track.album.images[0].url} width="25px" alt="" /></td>
                  <td>{track.track.name}</td>
                  <td>{track.track.artists.map((artist: any) => artist.name).join(', ')}</td>
                  <td>{track.track.album.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
    </>
  ) : null;
}
