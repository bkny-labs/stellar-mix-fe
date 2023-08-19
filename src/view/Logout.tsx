import { useEffect } from 'react';
import { logout } from '../services/api-service';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('spotifyToken');

  useEffect(() => {
    // Call the logout API
    logout(token || '')
      .then(() => {
        // Clear local storage or session storage
        localStorage.removeItem('spotifyToken');
        localStorage.removeItem('spotifyPlaylists');
        // Redirect to login or home page
        navigate('/login');
      })
      .catch((error) => {
        console.error("Logout error:", error);
        // Handle error, maybe redirect to an error page or show a notification
      });
  }, [token, navigate]);

  // You can return null or some kind of "Logging out..." message
  return null;
}

export default Logout;
