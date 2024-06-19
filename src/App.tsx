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
import { Intro } from './component/Intro';
import { DesktopIntro } from './component/DesktopIntro';
import Carousel from './component/Carousel';

interface AppProps {
  updateMoodData: (data: any) => void;
}

const AppContent: React.FC<AppProps> = ({ updateMoodData }) => {
  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const sunCalcData = useSelector((state: AppState) => state.sunCalcData);
  const weatherData = useSelector((state: AppState) => state.weather);
  const [showToast, setShowToast] = useState(isLoggedIn);
  const token = localStorage.getItem('spotifyToken');
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const location = useLocation();

  const toggleFilters = () => {
    setFilterIsOpen(!filterIsOpen);
  };

  const handleNav = () => {
    console.log('showNav', showNav);
    setShowNav(!showNav);
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
    if (token) {
      fetchUserProfile(token, dispatch)
      .then(data => setUserProfile(data))
      .catch(error => console.error("Error fetching user profile:", error));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowToast(true);
    }
  }, [isLoggedIn]);

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
          duration={5000}
          position="top-center"
          onClose={() => setShowToast(false)}
        />
      )}
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
      {
        location.pathname === '/' &&
        <Carousel 
        slidesToScroll={isMobile ? 1 : 3} 
        slidesToShow={isMobile ? 1 : 3} 
        dots={!isMobile} />
      }
      <div className="App">
        <div className="container">
          {isLoggedIn && userProfile && 
            <>
              <Header onNavClick={handleNav} userProfile={userProfile} toggleFilters={toggleFilters} updateMoodData={updateMoodData} />
              { showNav && (
                <nav className='nav'>
                  <Navigation 
                    loggedIn={isLoggedIn}
                    sunCalcData={sunCalcData}
                    weatherData={weatherData}
                  />
                </nav>
              )}
            </>
          }
          <div 
            className={showNav ? 'content' : 'content content-full'}
            style={isLoggedIn && userProfile && !isMobile && showNav ? { paddingRight: '18px', paddingLeft: '180px' } : {}}
          >
            <Routes>
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
