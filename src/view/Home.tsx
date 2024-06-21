/* eslint-disable jsx-a11y/anchor-is-valid */
import './Home.css';
import { FaGithub, FaStar, FaUserAstronaut } from 'react-icons/fa';
import SpaceBackground from '../component/Space';
import { useEffect, useState } from 'react';
import { SiOpenai } from 'react-icons/si';
import { Intro } from '../component/Intro';
import { DesktopIntro } from '../component/DesktopIntro';
import Carousel from '../component/Carousel';
import { useLocation } from 'react-router-dom';
import PrivacyModal from '../component/Privacy';
import { fetchUserProfile } from '../services/auth-service';
import { setLoggedInAction } from '../store/actions';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isXl, setIsXl] = useState(window.innerWidth >= 1200);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const setSlideCount = () => {
    switch (true) {
      case isMobile:
        return 1;
      case isTablet:
        return 3;
      case isDesktop:
        return 4;
      case isXl:
        return 6;
      default:
        return 1;
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      fetchUserProfile(token, setLoggedInAction).then(user => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024 && window.innerWidth < 1440);
      setIsXl(window.innerWidth >= 1440);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>
    <div className="space-background">
      <SpaceBackground />
    </div>
    <div className="landing">
      {
        isMobile && location.pathname === '/' &&
        <Intro />
      }
      {
        !isMobile && location.pathname === '/' &&
        <>
          <DesktopIntro />
        </>
      }
      {!isAuthenticated &&
      <div className="instructions">
        <div className="item">
          <p className='step'>Step 1</p>
          <h4>Open Spotify</h4>
        </div>
        <div className="item">
          <p className='step'>Step 2</p>
          <h4>Connect your Account</h4>
        </div>
        <div className="item">
          <p className='step'>Step 3</p>
          <h4>Get AI-powered Playlists</h4>
        </div>
        <div className="item">
          <p className='step'>Step 4</p>
          <h4>Playback and Share</h4>
        </div>
      </div>
      }

      {
        location.pathname === '/' &&
        <Carousel 
        slidesToScroll={setSlideCount()} 
        slidesToShow={setSlideCount()} 
        dots={!isMobile} />
      }

      <div className="features">
        <div className="feature">
          <SiOpenai size={40} />
          <h2>OpenAI-Powered</h2>
          <p>AI helps deliver you fresh playlists for your anything you want.</p>
        </div>
        <div className="feature">
          <FaStar size={40} />
          <h2>Cosmic</h2>
          <p>Playlists that adapt to the weather, moon phases, and sun position.</p>
        </div>
        <div className="feature">
          <FaUserAstronaut size={40} />
          <h2>Personalized</h2>
          <p>Discover curated playlists tailored to your taste and favorites.</p>
        </div>
    </div>




      <div className="about">
        <p className='small'>StellarMix is a free to use open source project by <a target='_blank' href="https://mikefortuna.com" rel="noreferrer">Mike Fortuna</a>.</p>
        <p className='small'>Powered by: <a href='https://openai.com' target='_blank' rel="noreferrer">OpenAI</a> | <a href='https://spotify.com' target='_blank' rel="noreferrer">Spotify</a> | <a href='https://openweathermap.org/' target='_blank' rel="noreferrer">OpenWeather</a> | <a href='http://suncalc.net/' target='_blank' rel="noreferrer">SunCalc</a></p>
        <p className='small'>
          <a onClick={openModal} href='#'>
            Privacy Policy
          </a>
        </p>
        <a className="github" href='https://github.com/bkny-labs/stellar-mix-fe' target='_blank' rel="noreferrer"><FaGithub size={25} /></a>
      </div>
    </div>
    <PrivacyModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Home;
