import React from 'react';
import { UserProfile } from '../types';
import logo from '../assets/logo.png';
import { IoFilterSharp } from 'react-icons/io5';

interface HeaderProps {
  userProfile: UserProfile;
  toggleFilters: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, toggleFilters }) => {
  return (
    <div className='header'>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="header-right">
        <div className="toggle-filter">
          <button className="filterButton" onClick={toggleFilters}><IoFilterSharp /></button>
        </div>
        <div 
          className="user-image"
          style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}>
        </div>
      </div>
    </div>
  );
};

export default Header;
