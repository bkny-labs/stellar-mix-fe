// Weather

const OPEN_WEATHER_API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;

export const getWeatherByLocation = (lat: number, long: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const API_KEY = OPEN_WEATHER_API_KEY;
      const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`;
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (data.cod !== 200) { // Check for error
          reject(data.message);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  };