// SunCalc
import * as SunCalc from 'suncalc';

export const getSunCalcData = (lat: number, long: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        const sunTimes = SunCalc.getTimes(new Date(), lat, long);
        const moonIllumination = SunCalc.getMoonIllumination(new Date());
        const data = {
          sunrise: sunTimes.sunrise.toISOString(),
          sunset: sunTimes.sunset.toISOString(),
          moonPhase: moonIllumination.phase
        };
  
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };