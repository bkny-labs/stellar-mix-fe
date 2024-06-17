import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import logo from '../assets/logo.png';
import Spotlight from './Spotlight';
import { FaWandMagicSparkles } from "react-icons/fa6";

interface HeaderProps {
  userProfile: UserProfile;
  toggleFilters: () => void;
  updateMoodData: (data: any) => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, toggleFilters, updateMoodData }) => {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [locked, setLocked] = useState(false);

  const toggleSpotlight = () => {
    setIsSpotlightOpen(prevState => !prevState);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'INPUT') {
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      toggleSpotlight();
    } else if (event.key === 'Escape' && isSpotlightOpen) {
      setIsSpotlightOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const spotifyPlaylists = JSON.parse(localStorage.getItem('spotifyPlaylists') || '[]');
    if (spotifyPlaylists.length === 0) {
      setIsSpotlightOpen(true);
      setLocked(true);
    } else {
      setLocked(false);
    }
  }, []);

  return (
    <div className='header'>
      <Spotlight isOpen={isSpotlightOpen} toggleSpotlight={toggleSpotlight} updateMoodData={updateMoodData} locked={locked} setLocked={setLocked} />
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="header-right">
        <button onClick={toggleSpotlight}><FaWandMagicSparkles /></button>
        <div 
          className="user-image"
          style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}>
        </div>
      </div>
    </div>
  );
};

export default Header;
