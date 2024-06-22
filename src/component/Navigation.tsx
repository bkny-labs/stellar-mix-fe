import { Link, useLocation } from 'react-router-dom';
import { FaCog, FaMusic, FaRegMoon } from 'react-icons/fa';
import { GiSunrise, GiSunset } from 'react-icons/gi';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { BsThermometerSun } from 'react-icons/bs';
import { WiHumidity } from 'react-icons/wi';
import { CgLogOut } from 'react-icons/cg';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import { logout } from '../services/auth-service';
import { RiPlayListFill } from "react-icons/ri";
import ThemeSwapper from './ThemeSwap';

interface NavigationProps {
  loggedIn?: boolean;
  sunCalcData?: any;
  weatherData?: any;
}

export const Navigation: React.FC<NavigationProps> = ({ loggedIn = false, sunCalcData, weatherData }) => {
  const location = useLocation();
  const sunriseTime = DateTime.fromISO(sunCalcData?.sunrise, { setZone: true }).toLocaleString(DateTime.TIME_SIMPLE);
  const localSunset = DateTime.fromISO(sunCalcData?.sunset).setZone('local');
  const sunsetTime = localSunset.toLocaleString(DateTime.TIME_24_SIMPLE);
  const dispatch = useDispatch();

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

  function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const userLogout = async () => {
    try {
      await logout(dispatch);
      loggedIn = false;
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <div className='nav-container'>
      {loggedIn && (
      <ul>
          <li>
          <Link 
            to="/browse" 
            className={location.pathname === "/browse" ? "active" : ""}
          >
            <FaMusic /> Browse
          </Link>
        </li>
        <li>
          <Link 
            to="/favorites" 
            className={location.pathname === "/favorites" ? "active" : ""}
          >
            <RiPlayListFill /> Favorites
          </Link>
        </li>
        <li>
          <Link 
            to="/settings" 
            className={location.pathname === "/settings" ? "active" : ""}
          >
            <FaCog /> Settings
          </Link>
        </li>
        <li>
          <Link
            to="#" 
            onClick={userLogout}>
              <CgLogOut /> Logout
          </Link>
        </li>
      </ul>
      )}
    <div className='sun-calc-data'>
      <ThemeSwapper />
      {weatherData && (
        <>  
        <p><BsThermometerSun /> {((weatherData?.main?.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</p>
        <p><TiWeatherPartlySunny /> {toTitleCase(weatherData?.weather?.[0]?.description || "")}</p>
        <p><WiHumidity /> {weatherData?.main?.humidity}%</p>
        </>
      )}
      {sunCalcData && (
        <>
        <p><GiSunrise /> {sunriseTime}</p>
        <p><GiSunset /> {sunsetTime}PM</p>
        <p><FaRegMoon /> {getMoonPhaseLabel(sunCalcData?.moonPhase)}</p>
        </>
        )}
    </div>
    </div>
  );
}