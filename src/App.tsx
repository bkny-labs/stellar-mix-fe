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
import { AppState } from './model/state';
import Header from './component/Header';
import Settings from './view/Settings';
import Toast from './component/Toast';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from './services/auth-service';
import { UserProfile } from './types';

const App: React.FC = () => {
  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const sunCalcData = useSelector((state: AppState) => state.sunCalcData);
  const weatherData = useSelector((state: AppState) => state.weather);
  const [showToast, setShowToast] = useState(isLoggedIn);
  const token = localStorage.getItem('spotifyToken');
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 768;

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
  
  return (
    <Router>
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
              <Header userProfile={userProfile} />
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
                ? { paddingRight: '18px', paddingLeft: '195px' } 
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
