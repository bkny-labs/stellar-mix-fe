import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../model/state';

const Home: React.FC = () => {
  const sunCalcData = useSelector((state: AppState) => state.sunCalcData);

  function getMoonPhaseLabel(phase: number): string {
    if (phase === 0) return 'New Moon';
    if (phase > 0 && phase < 0.25) return 'Waxing Crescent';
    if (phase === 0.25) return 'First Quarter';
    if (phase > 0.25 && phase < 0.5) return 'Waxing Gibbous';
    if (phase === 0.5) return 'Full Moon';
    if (phase > 0.5 && phase < 0.75) return 'Waning Gibbous';
    if (phase === 0.75) return 'Last Quarter';
    if (phase > 0.75) return 'Waning Crescent';
    return 'Unknown Phase';
  }

  return (
    <div>

      {sunCalcData && (
        <div>
          <p>Sunrise: {new Date(sunCalcData.sunrise).toLocaleTimeString()}</p>
          <p>Sunset: {new Date(sunCalcData.sunset).toLocaleTimeString()}</p>
          <p>Moon Phase: {getMoonPhaseLabel(sunCalcData.moonPhase)}</p>
      </div>
      )}

    </div>
  );
};

export default Home;
