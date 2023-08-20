import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api-service';
import { useDispatch } from 'react-redux';

type UserProfile = {
  display_name: string;
  images: { url: string }[];
};

const Header: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const token = localStorage.getItem('spotifyToken');
  const dispatch = useDispatch;

  setTimeout(() => {
    const toast = document.querySelector('.toast');
    toast?.classList.add('hide');
  }, 3000);

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
        {/* <span>{userProfile.display_name}</span> */}
        {/* ... other header elements */}
        </div>
        <div className="toast">
            <span>{userProfile.display_name}</span>
        </div>
    </>
  );
};

export default Header;