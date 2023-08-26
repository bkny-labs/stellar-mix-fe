import React from 'react';
import { UserProfile } from '../types';
import logo from '../assets/logo.png';

interface HeaderProps {
  userProfile: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ userProfile }) => {
  return (
    <div className='header'>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div 
          className="user-image"
          style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}>
      </div>
    </div>
  );
};

export default Header;
