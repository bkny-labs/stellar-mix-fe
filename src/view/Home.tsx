import './Home.css';
import { FaGithub, FaStar, FaUserAstronaut } from 'react-icons/fa';
import SpaceBackground from '../component/Space';
import { useEffect } from 'react';
import { SiOpenai } from 'react-icons/si';

function Home() {
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem('spotifyToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('tokenExpiryTime');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <div className="space-background">
      <SpaceBackground />
    </div>
    <div className="landing">
      {!isLoggedIn &&
      <div className="instructions">
        <div className="item">
          <p className='step'>Step 1</p>
          <h4>Connect your Spotify</h4>
        </div>
        <div className="item">
          <p className='step'>Step 2</p>
          <h4>Get curated playlists</h4>
        </div>
        <div className="item">
          <p className='step'>Step 2</p>
          <h4>Fine tune with AI</h4>
        </div>
        <div className="item">
          <p className='step'>Step 3</p>
          <h4>Playback and Share</h4>
        </div>
      </div>
      }

      <div className="features">
        <div className="feature">
          <SiOpenai size={40} />
          <h2>OpenAI-Powered</h2>
          <p>AI helps deliver you fresh playlists for your anything you want.</p>
        </div>
        <div className="feature">
          <FaStar size={40} />
          <h2>Cosmic</h2>
          <p>Playlists that adapt to the weather, moon phases, and sun position.</p>
        </div>
        <div className="feature">
          <FaUserAstronaut size={40} />
          <h2>Personalized</h2>
          <p>Discover curated playlists tailored to your taste and favorites.</p>
        </div>
    </div>




      <div className="about">
        <p className='small'>StellarMix is a free to use open source project by <a href="https://mikefortuna.com" rel="noreferrer">Mike Fortuna</a>.</p>
        <p className='small'>Powered by: <a href='https://openai.com' target='_blank' rel="noreferrer">OpenAI</a> | <a href='https://spotify.com' target='_blank' rel="noreferrer">Spotify</a> | <a href='https://openweathermap.org/' target='_blank' rel="noreferrer">OpenWeather</a> | <a href='http://suncalc.net/' target='_blank' rel="noreferrer">SunCalc</a></p>
        <a className="github" href='https://github.com/bkny-labs/stellar-mix-fe' target='_blank' rel="noreferrer"><FaGithub size={25} /></a>
      </div>
    </div>
    </>
  );
}

export default Home;
