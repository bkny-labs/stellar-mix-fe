import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';
import Home from './view/Home';
import './App.css';
import Browse from './view/Browse';
import { Navigation } from './component/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from './store/state';
import Header from './component/Header';
import Settings from './view/Settings';
import Toast from './component/Toast';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from './services/auth-service';
import { UserProfile } from './types';
import MyFavorites from './view/MyFavorites';
import { setLoggedInAction } from './store/actions';

interface AppProps {
  updateMoodData: (data: any) => void;
}

const AppContent: React.FC<AppProps> = ({ updateMoodData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const sunCalcData = useSelector((state: AppState) => state.sunCalcData);
  const weatherData = useSelector((state: AppState) => state.weather);
  const token = localStorage.getItem('spotifyToken');
  const dispatch = useDispatch();
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();

  const toggleFilters = () => {
    setFilterIsOpen(!filterIsOpen);
  };

  const handleNav = () => {
    setShowNav(!showNav);
  };

  useEffect(() => {
    const handleResize = () => {
      setShowNav(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      fetchUserProfile(token, setLoggedInAction).then(user => {
        if (user) {
          setIsAuthenticated(true);
          setUserProfile(user);
        } else {
          setIsAuthenticated(false);
        }
      }).catch(error => console.error("Error fetching user profile:", error));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowNav(false);
    } else if (window.innerWidth > 900) {
      setShowNav(true);
    }
  }, []);

  return (
    <>
    {showToast && (
      <Toast
        message={'Welcome to StellarMix, ' + userProfile?.display_name + '!' }
        type="success"
        duration={7000}
        position="bottom-center"
        onClose={() => setShowToast(false)}
      />
    )}
      <div 
      className={location.pathname === '/' ? 'App home' : 'App ' + location.pathname}>
        <div className="container">
          {isAuthenticated && userProfile && 
            <>
              <Header onNavClick={handleNav} userProfile={userProfile} toggleFilters={toggleFilters} updateMoodData={updateMoodData} />
              {location.pathname !== '/' &&
                <nav className={`nav ${showNav ? 'show' : ''}`}>
                  <Navigation 
                    loggedIn={isAuthenticated}
                    sunCalcData={sunCalcData}
                    weatherData={weatherData}
                  />
                </nav>
                }
            </>
          }
          <div 
            className={showNav && location.pathname !== '/' ? 'content nav-open' : 'content'}>
            <Routes>
              {/* <Route path="/callback" element={<AuthCallback />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/favorites" element={<MyFavorites />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC<AppProps> = (props) => (
  <Router>
    <AppContent {...props} />
  </Router>
);

export default App;
