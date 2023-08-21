import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from "../model/state";
import { setUserGenresAction } from "../model/actions";
import { UserProfile } from "../types";
import { fetchAvailableGenres, fetchUserProfile } from "../services/api-service";
import { CiLocationOn } from 'react-icons/ci';
import { FiUsers } from 'react-icons/fi';
import { FaSpotify } from "react-icons/fa";

function Settings() {
    const userGenresFromStore = useSelector((state: AppState) => state.userSettings.genres);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const token = localStorage.getItem('spotifyToken');
    const dispatch = useDispatch();
    const [allGenres, setAllGenres] = useState<string[]>([]);

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
        console.log(userProfile);
      }
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
        dispatch(setUserGenresAction(selectedGenres));
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

            <h2>Favorite Genres</h2>
            <p>Below is a list of recommended genres based on your Spotify plays. You can choose to include/remove any you want to fine tune StellarMix.</p>
            <div className="genre-select-buttons">
                <button onClick={selectAllGenres}>Select All</button> |
                <button onClick={deselectAllGenres}>Select None</button>
              </div>
            <div className="genres-list">
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
            <button className="save-button" onClick={handleSave}>Save Settings</button>
        </div>
    );
}

export default Settings;
