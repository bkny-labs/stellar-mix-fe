import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ userProfile }) => {
  return (
    <div className='header'>
      <div 
          className="user-image"
          style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}>
      </div>
    </div>
  );
};

export default Header;
