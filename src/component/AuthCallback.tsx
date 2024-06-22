import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSpotifyAccessToken } from '../services/auth-service';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      getSpotifyAccessToken(code, dispatch)
        .then(() => {
          console.log('Token set successfully, navigating to /browse');
          navigate('/browse');
        })
        .catch(error => {
          console.error('Error during token exchange:', error);
          navigate('/');
        });
    } else {
      console.log('No code found in URL, navigating to /login');
      navigate('/');
    }
  }, [location, navigate, dispatch]);

  return <div>Loading...</div>;
};

export default AuthCallback;
