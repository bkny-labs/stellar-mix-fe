import React from 'react';
import './Home.css';
import { useSelector } from 'react-redux';
import { AppState } from '../model/state';
import { getAuthURL } from '../services/api-service';
import { FaCloudRain, FaGithub, FaMoon, FaSpotify } from 'react-icons/fa';
import logo from '../assets/sm_logo.png';

function Home() {
  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);
  const handleLogin = () => {
    window.location.href = getAuthURL();
  }
  return (
    <div className="landing">

      <div className="hero">
        <img src={logo} alt="logo" />
        <h1>Beats Beyond the Atomosphere</h1>
        <p>Let the weather, sun and moon inspire your next playlist!</p>
        {!isLoggedIn &&
          <div>
            <button className='spotify-login' onClick={handleLogin}><FaSpotify /> Connect with Spotify</button> 
          </div>
          }
      </div>

      <div className="features">
        <div className="feature">
          <FaSpotify size={40} />
          <h2>Spotify Connect</h2>
          <p>Connect with Spotify to for personalization and genre customization.</p>
        </div>
        <div className="feature">
          <FaMoon size={40} />
          <h2>Celestial Influenced</h2>
          <p>Our unique algorithm considers the positions of celestial bodies to curate your playlist.</p>
        </div>
        <div className="feature">
          <FaCloudRain size={40} />
          <h2>Weather Integration</h2>
          <p>Whether it's sunny, rainy, or snowy, your current weather plays a part in the playlists.</p>
        </div>
      </div>

      <div className="about">
        <h2>About StellarMix</h2>
        <p>StellarMix is free to use and is an open source project created by <a href="https://mikefortuna.com" target='_blank' rel="noreferrer">Mike Fortuna</a>.</p>
        <p className='small'>Powered by: <a href='https://spotify.com' target='_blank' rel="noreferrer">Spotify</a> | <a href='https://openweathermap.org/' target='_blank' rel="noreferrer">OpenWeather</a> | <a href='http://suncalc.net/' target='_blank' rel="noreferrer">SunCalc</a></p>
        <a className="github" href='https://github.com/bkny-labs/stellar-mix-fe' target='_blank' rel="noreferrer"><FaGithub size={25} /></a>
      </div>
    </div>
  );
}

export default Home;
