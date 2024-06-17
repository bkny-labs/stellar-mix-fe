import SunCalc from 'suncalc';

export const getSunCalcData = (lat: number, lon: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const sunTimes = SunCalc.getTimes(new Date(), lat, lon);
      const moonIllumination = SunCalc.getMoonIllumination(new Date());

      // console.log('SunTimes:', sunTimes);
      // console.log('MoonIllumination:', moonIllumination);

      if (isNaN(sunTimes.sunrise.getTime()) || isNaN(sunTimes.sunset.getTime())) {
        throw new Error('Invalid time value');
      }

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
