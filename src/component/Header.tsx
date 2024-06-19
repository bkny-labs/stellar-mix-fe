import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import logo from '../assets/logo4.png';
import Spotlight from './Spotlight';
import { Link } from 'react-router-dom';
import { RiMenu4Fill } from "react-icons/ri";


interface HeaderProps {
  userProfile: UserProfile;
  toggleFilters: () => void;
  updateMoodData: (data: any) => void;
  onNavClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, toggleFilters, updateMoodData, onNavClick }) => {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isLoggedIn = localStorage.getItem('isLoggedIn');

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <>
      <Spotlight isOpen={isSpotlightOpen} toggleSpotlight={toggleSpotlight} updateMoodData={updateMoodData} locked={locked} setLocked={setLocked} />
      <div className='header'>
        <div className="logo">
          {
            isMobile && isLoggedIn &&
            <RiMenu4Fill onClick={onNavClick} />
          }
          <Link to="/">
            <img src={logo} alt="Logo" />  
          </Link>
        </div>
        <div className="header-right">
          <button onClick={toggleSpotlight}>Create Playlists</button>
          {
            !isMobile &&
            <div 
              className="user-image"
              style={{ backgroundImage: `url(${userProfile.images[0]?.url})` }}>
            </div>
          }
          
        </div>
      </div>
    </>
  );
};

export default Header;
