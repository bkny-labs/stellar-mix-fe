import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from 'react-router-dom';
import Home from './view/Home';
import Weather from './view/Weather';
import Spotify from './view/Spotify';
import MainController from './controller/main-controller'; // Import the new MainController
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <MainController>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/weather">Weather</Link>
                </li>
                <li>
                  <Link to="/spotify">Spotify</Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/spotify" element={<Spotify />} />
            </Routes>
          </MainController>
        </header>
      </div>
    </Router>
  );
}

export default App;
