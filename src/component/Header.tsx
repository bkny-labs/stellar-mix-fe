import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api-service';
import { useDispatch } from 'react-redux';
import { UserProfile } from '../types';

const Header: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const token = localStorage.getItem('spotifyToken');
  const dispatch = useDispatch;

  useEffect(() => {
    if (token) {
      fetchUserProfile(token, dispatch)
        .then(data => setUserProfile(data))
        .catch(error => console.error("Error fetching user profile:", error));
    }
  }, [token, dispatch]);

  if (!userProfile) return null;

  return (
    <>
        <div className='header'>
        <div 
            className="user-image"
            style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}></div>
        </div>
    </>
  );
};

export default Header;
