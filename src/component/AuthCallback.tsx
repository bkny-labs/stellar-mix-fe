import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSpotifyAccessToken } from '../services/auth-service';
import { setLoggedInAction } from '../store/actions';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      getSpotifyAccessToken(code, setLoggedInAction)
        .then(() => navigate('/browse'))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
