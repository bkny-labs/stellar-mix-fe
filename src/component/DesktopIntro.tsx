import bg from '../assets/bg5.jpg';
import logo from '../assets/logo2.png';
import { getAuthURL } from '../services/auth-service';
import './Intro.css';
import { FaHeadphones, FaSpotify } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface DesktopIntroProps {
  loggedIn?: boolean;
  sunCalcData?: any;
  weatherData?: any;
}

export const DesktopIntro: React.FC<DesktopIntroProps> = () => {
  const isLoggedIn = localStorage.getItem('loggedIn');
  const navigate = useNavigate();
  const handleLogin = () => {
    window.location.href = getAuthURL();
  };
  const goToBrowse = () => {
    navigate('/browse');
  }

  return (
    <>
      <div className='top'>
          <img src={logo} alt='StellarMix Logo' className='logo' />
      </div>
      <div className='intro desktop'>
        <div>
          <div className='hero-img' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
          </div>
          <h1 className='stellar'>Your AI Companion for the Perfect Spotify Mixtapes</h1>
          <p>Connect your Spotify account to get started.</p>
          {!isLoggedIn &&
          <div className='login-container'>
            <button className='spotify-login' onClick={handleLogin}><FaSpotify /> Connect with Spotify</button> 
          </div>
          }

          {isLoggedIn &&
          <div className='login-container'>
            <button className='get-started' onClick={goToBrowse}><FaHeadphones /> Get Started</button> 
          </div>
          }
        </div>
      </div> 
    </>
  );
}