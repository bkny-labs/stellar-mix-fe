import {
  BrowserRouter as Router,
  Route,
  Routes
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
import { fetchUserProfile, getAuthURL, logout } from './services/auth-service';
import { UserProfile } from './types';
import { FilterDrawer } from './component/Filters';
import Modal from './component/Modal';

const App: React.FC = () => {
  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const sunCalcData = useSelector((state: AppState) => state.sunCalcData);
  const weatherData = useSelector((state: AppState) => state.weather);
  const [showToast, setShowToast] = useState(isLoggedIn);
  const token = localStorage.getItem('spotifyToken');
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 768;
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFilters = () => {
    setFilterIsOpen(!filterIsOpen);
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile(token, dispatch)
      .then(data => setUserProfile(data))
      .catch(error => console.error("Error fetching user profile:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowToast(true);
    }
  }, [isLoggedIn]); 

  useEffect(() => {
    const tokenExpiryTime = localStorage.getItem('tokenExpiryTime');
    if (tokenExpiryTime) {
      const currentTime = new Date().getTime();
      const timeRemaining = parseInt(tokenExpiryTime) - currentTime;

      if (timeRemaining <= 10000) {
        // Show the modal if the token is about to expire in 1 minute or less
        setIsModalOpen(true);
        console.log('isModalOpen', isModalOpen);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsModalOpen(false);
    window.location.href = getAuthURL();
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    logout(dispatch);
    
  };
  return (
    <Router>
      <Modal isOpen={isModalOpen} onLogin={handleLogin} onLogout={handleLogout} />
      {showToast && (
        <Toast
          message={'Welcome to StellarMix, ' + userProfile?.display_name + '!' }
          type="success"
          duration={5000}
          position="top-center"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="App">
          <div className="container">
            {isLoggedIn && userProfile && 
              <>
              <Header userProfile={userProfile} toggleFilters={toggleFilters} />
              <FilterDrawer isOpen={filterIsOpen} />
              <nav className='nav'>
                <Navigation 
                  loggedIn={isLoggedIn}
                  sunCalcData={sunCalcData}
                  weatherData={weatherData}
                />
              </nav>
              </>
            }
            <div className="content"
            style={
              isLoggedIn && userProfile && !isMobile
                ? { paddingRight: '18px', paddingLeft: '180px' } 
                : {}
              }
              >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
      </div>
    </Router>
  );
}

export default App;
