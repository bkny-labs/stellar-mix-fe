import './Home.css';
import { useSelector } from 'react-redux';
import { AppState } from '../model/state';
import { getAuthURL } from '../services/api-service';
import { FaCompass, FaGithub, FaSpotify, FaUserAstronaut } from 'react-icons/fa';
import logo from '../assets/sm_logo.png';
import SpaceBackground from '../component/Space';

function Home() {
  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);
  const handleLogin = () => {
    window.location.href = getAuthURL();
  }
  return (
    <>
    <div className="space-background">
      <SpaceBackground />
    </div>
    <div className="landing">

      <div className="hero">
        <img src={logo} alt="logo" />
        <h1>Cosmic Mix</h1>
        <p>StellarMix crafts the ultimate playlist for your moment, blending your music tastes with cues from the world around you – day or night, rain or shine, cosmos in motion. Dive into a universe of sound, all through your Spotify.</p>
        {!isLoggedIn &&
          <div>
            <button className='spotify-login' onClick={handleLogin}><FaSpotify /> Connect with Spotify</button> 
          </div>
          }
      </div>

      <div className="features">
        <div className="feature">
          <FaUserAstronaut size={40} />
          <h2>Personalized Playlists</h2>
          <p>Discover curated playlists tailored to your unique music tastes and preferences.</p>
        </div>
        <div className="feature">
          <FaCompass size={40} />
          <h2>Dynamic Adaptation</h2>
          <p>Playlists that adapt to the world around you, factoring in celestial events and your local weather.</p>
        </div>
        <div className="feature">
          <FaSpotify size={40} />
          <h2>Seamless Integration</h2>
          <p>Easily sync with Spotify to blend your favorites with our recommendations.</p>
        </div>
    </div>


      <div className="about">
        <p className='small'>StellarMix is a free to use open source project by <a href="https://mikefortuna.com" target='_blank' rel="noreferrer">Mike Fortuna</a>.</p>
        <p className='small'>Powered by: <a href='https://spotify.com' target='_blank' rel="noreferrer">Spotify</a> | <a href='https://openweathermap.org/' target='_blank' rel="noreferrer">OpenWeather</a> | <a href='http://suncalc.net/' target='_blank' rel="noreferrer">SunCalc</a></p>
        <a className="github" href='https://github.com/bkny-labs/stellar-mix-fe' target='_blank' rel="noreferrer"><FaGithub size={25} /></a>
      </div>
    </div>
    </>
  );
}

export default Home;
