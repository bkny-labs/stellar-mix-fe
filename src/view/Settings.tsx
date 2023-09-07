import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from "../store/state";
import { setUserGenresAction } from "../store/actions";
import { UserProfile } from "../types";
import { fetchUserProfile } from "../services/auth-service";
import { fetchAvailableGenres } from '../services/spotify-service';
import { CiLocationOn } from 'react-icons/ci';
import { FiUsers } from 'react-icons/fi';
import { FaSpotify } from "react-icons/fa";
import Toggle from "../component/Toggle";

function Settings() {
    const userGenresFromStore = useSelector((state: AppState) => state.userSettings.genres);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const token = localStorage.getItem('spotifyToken');
    const dispatch = useDispatch();
    const [allGenres, setAllGenres] = useState<string[]>([]);
    const [toggleDarkMode, setToggleDarkMode] = useState(true);
    const [toggleExplicit, setToggleExplicit] = useState(false);
    const [toggleNotifications, setToggleNotifications] = useState(false);

    useEffect(() => {
      async function fetchGenres() {
          if (!token) {
              console.error('Spotify token is missing.');
              return;
          }
  
          const genres = await fetchAvailableGenres(token);
          if (genres) {
              setAllGenres(genres);
          } else {
              console.log("Failed to get genres.");
              // Set default genres in case the fetch fails
              setAllGenres(["rock", "pop", "jazz", "classical", "hip-hop", "country"]);
          }
      }
  
      fetchGenres();
  }, [token]);
  

    useEffect(() => {
        setSelectedGenres(userGenresFromStore);
    }, [userGenresFromStore]);

    useEffect(() => {
      if (token) {
        fetchUserProfile(token, dispatch)
        .then(data => setUserProfile(data))
        .catch(error => console.error("Error fetching user profile:", error));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, dispatch]);
  
    if (!userProfile) return null;

    const toggleGenre = (genre: any) => {
        setSelectedGenres(prev => 
            prev.includes(genre) 
            ? prev.filter(g => g !== genre)
            : [...prev, genre]
        );
    };

    const selectAllGenres = () => {
      setSelectedGenres(allGenres);
    }

    const deselectAllGenres = () => {
      setSelectedGenres([]);
    }

    const handleSave = () => {
        console.log(selectedGenres);
        dispatch(setUserGenresAction(selectedGenres));
        localStorage.setItem('userGenres', JSON.stringify(selectedGenres));
    };

    return (
        <div className="settings">
          <h1> Settings</h1>
            <div className="contact-card">
              <div className="user-image" style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}></div>
              <div className="user-info">
                  <span className="user-name">{userProfile.display_name} | {userProfile.email}</span>
                  <p className="user-bio">Spotify {userProfile.product} user.</p>
                  <div className="user-activity">
                      <span><CiLocationOn /> &nbsp; {userProfile.country}</span> |
                      <span><FiUsers /> &nbsp; {userProfile.followers?.total} Followers</span> |
                      <span><FaSpotify /> &nbsp; <a href={userProfile.external_urls?.spotify} target="_blank" rel="noreferrer">View profile</a></span>
                  </div>
              </div>
          </div>
            <h2>General</h2>
            <Toggle 
                checked={toggleDarkMode} 
                onChange={setToggleDarkMode} 
                id="toggleDarkMode" 
                label="Enable Dark Mode" 
            />

            <Toggle 
                checked={toggleExplicit} 
                onChange={setToggleExplicit} 
                id="toggleExplicit" 
                label="Enable Explicit Content" 
            />

            <Toggle 
                checked={toggleNotifications} 
                onChange={setToggleNotifications} 
                id="toggleNotifications" 
                label="Enable Notifications" 
            />
            <h2>Genres</h2>
            <p>Below are recommended genres based on your Spotify plays. You can choose to include/remove any you want to customize your available filters.</p>
            <div className="checkbox-select-buttons">
                <button onClick={selectAllGenres}>Select All</button> |
                <button onClick={deselectAllGenres}>Select None</button>
              </div>
            <div className="checkbox-list">
            {allGenres.map(genre => (
                <div key={genre}>
                  <input 
                    type="checkbox"
                    id={genre}
                    className="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  <label htmlFor={genre} className="genre-label">
                    {genre}
                  </label>
                </div>
            ))}
            </div>
            <div className="action-bar">
              <button className="save-button" onClick={handleSave}>Save Settings</button>
            </div>
        </div>
    );
}

export default Settings;
