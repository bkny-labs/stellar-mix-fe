import { useEffect } from 'react';
import logo from '../assets/logo2.png';
import { getAuthURL } from '../services/auth-service';
import './Intro.css';
import { FaCheckCircle, FaHeadphones, FaSpotify } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface DesktopIntroProps {
  loggedIn?: boolean;
  sunCalcData?: any;
  weatherData?: any;
}

export const DesktopIntro: React.FC<DesktopIntroProps> = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const navigate = useNavigate();
  const handleLogin = () => {
    window.location.href = getAuthURL();
  };
  const goToBrowse = () => {
    navigate('/browse');
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('spotifyToken');
    
    if (!accessToken) {
      localStorage.removeItem('spotifyToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('tokenExpiryTime');
    }
  }, []);

  return (
    <div className={isLoggedIn ? 'logged-in' : ''}>
      <div className='top'>
          <img src={logo} alt='StellarMix Logo' className='logo' />
      </div>
      <div className='intro desktop'>
        <div>
          {isLoggedIn &&
            <>
            <h1 className='check'><FaCheckCircle /></h1>
            <h1 className='stellar'>Spotify Connected.</h1>
            <p>You're Stellar-ready. Launch the app below to start creating and playing.</p>
            </>
          }
          {!isLoggedIn &&
          <>
            <h1 className='stellar'>Finally, an AI that understands your eclectic music taste better than your friends.</h1>
            <p>Connect your Spotify account and start discovering personalized music mixes tailored just for you.</p>
            <div className='login-container'>
              <button className='spotify-login' onClick={handleLogin}><FaSpotify /> Connect with Spotify</button> 
            </div>
          </>
          }

          {isLoggedIn &&
          <div className='login-container'>
            <button className='get-started' onClick={goToBrowse}><FaHeadphones /> Launch App</button> 
          </div>
          }
        </div>
      </div> 
    </div>
  );
}