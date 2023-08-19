import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
    showLogout?: boolean;
  }

export const Navigation: React.FC<NavigationProps> = ({ showLogout = false }) => {
    const location = useLocation();

  return (
    <ul>
      <li>
        <Link 
          to="/" 
          className={location.pathname === "/" ? "active" : ""}
        >
          Home
        </Link>
      </li>
      <li>
        <Link 
          to="/browse" 
          className={location.pathname === "/browse" ? "active" : ""}
        >
          Browse
        </Link>
      </li>
      <li>
        <Link 
          to="/weather" 
          className={location.pathname === "/weather" ? "active" : ""}
        >
          Weather
        </Link>
      </li>
      <li>
        <Link 
          to="/favorites" 
          className={location.pathname === "/favorites" ? "active" : ""}
        >
          Favorites
        </Link>
      </li>
      <li>
        <Link 
          to="/settings" 
          className={location.pathname === "/settings" ? "active" : ""}
        >
          Settings
        </Link>
      </li>
      {showLogout?? <li>
        <Link 
          to="/logout" 
          className={location.pathname === "/logout" ? "active" : ""}
        >
          Logout
        </Link>
      </li>}
    </ul>
  );
}