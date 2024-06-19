import bg from '../assets/bg.png';
import logo from '../assets/logo2.png';
import { getAuthURL } from '../services/auth-service';
import './Intro.css';
import { FaHeadphones, FaSpotify } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface IntroProps {
  loggedIn?: boolean;
  sunCalcData?: any;
  weatherData?: any;
}

export const Intro: React.FC<IntroProps> = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const navigate = useNavigate();
  const handleLogin = () => {
    window.location.href = getAuthURL();
  };
  const goToBrowse = () => {
    navigate('/browse');
  }

  return (
    <>
      <div style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.8)), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}
      className={isLoggedIn ? 'intro logged-in' : 'intro'}>
        <div>
          <img src={logo} alt='StellarMix Logo' className='logo' />
        </div>
        <div>
        { isLoggedIn &&
        <>
        <h1 className='stellar'>Spotify Connected.</h1>
        <p>You're Stellar-ready. Launch the app below to start creating and playing.</p>
        </>
        }
          {!isLoggedIn &&
          <>
            <h1 className='stellar'>Your AI Companion for the Perfect Spotify Mixtape</h1>
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
    </>
  );
}