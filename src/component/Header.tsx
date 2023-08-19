import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api-service';

type UserProfile = {
  display_name: string;
  images: { url: string }[];
};

const Header: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const token = localStorage.getItem('spotifyToken');

  useEffect(() => {
    if (token) {
      fetchUserProfile(token)
        .then(data => setUserProfile(data))
        .catch(error => console.error("Error fetching user profile:", error));
    }
  }, [token]);

  if (!userProfile) return null;

  return (
    <div className='header'>
      <div 
        className="user-image"
        style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}></div>
      {/* <span>{userProfile.display_name}</span> */}
      {/* ... other header elements */}
    </div>
  );
};

export default Header;
