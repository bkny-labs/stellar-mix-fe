import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AppState } from '../model/state';
import { FaCog, FaHome, FaMixcloud, FaMusic, FaRegHeart, FaRegMoon } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import { GiSunrise, GiSunset } from 'react-icons/gi';
import { useEffect } from 'react';

interface NavigationProps {
    loggedIn?: boolean;
  }

export const Navigation: React.FC<NavigationProps> = ({ loggedIn = false }) => {
    const location = useLocation();
    const sunCalcData = useSelector((state: AppState) => state.sunCalcData);

  function getMoonPhaseLabel(phase: number): string {
    if (phase === 0) return 'New Moon';
    if (phase > 0 && phase < 0.25) return 'Waxing Crescent';
    if (phase === 0.25) return 'First Quarter';
    if (phase > 0.25 && phase < 0.5) return 'Waxing Gibbous';
    if (phase === 0.5) return 'Full Moon';
    if (phase > 0.5 && phase < 0.75) return 'Waning Gibbous';
    if (phase === 0.75) return 'Last Quarter';
    if (phase > 0.75) return 'Waning Crescent';
    return 'Unknown Phase';
  }

  useEffect(() => {
    // uhh
  }, [loggedIn]);


  return (
    <div className='nav-container'>
    <ul>
      <li>
        <Link 
          to="/" 
          className={location.pathname === "/" ? "active" : ""}
        >
          <FaHome /> Home
        </Link>
      </li>
      <li>
        <Link 
          to="/browse" 
          className={location.pathname === "/browse" ? "active" : ""}
        >
          <FaMusic /> Browse
        </Link>
      </li>
      {/* <li>
        <Link 
          to="/favorites" 
          className={location.pathname === "/favorites" ? "active" : ""}
        >
          <FaRegHeart /> Favorites
        </Link>
      </li> */}
      {loggedIn && (
      <li>
        <Link 
          to="/settings" 
          className={location.pathname === "/settings" ? "active" : ""}
        >
          <FaCog /> Settings
        </Link>
      </li>
      )}

    </ul>

    {sunCalcData && (
    <div className='sun-calc-data'>
        <p><GiSunrise /> {new Date(sunCalcData.sunrise).toLocaleTimeString()}</p>
        <p><GiSunset /> {new Date(sunCalcData.sunset).toLocaleTimeString()}</p>
        <p><FaRegMoon /> {getMoonPhaseLabel(sunCalcData.moonPhase)}</p>
    </div>
    )}
    </div>
  );
}