import { AppState } from "../model/state";

export const getMusicalMood = (data: AppState): { moods: string[], genres: string[] } => {
  let moods: string[] = [];
  const userGenres = data.userSettings.genres;
  const mainWeather = data?.weather?.weather?.[0]?.main.toLowerCase();
    // Mood tags based on weather
    if (data.weather && mainWeather) {
        switch (mainWeather) {
            case 'clear':
                moods.push('upbeat', 'energetic', 'bright', 'happy', 'jam', 'vivid', 'cheerful', 'sunny', 'warm', 'summer', 'fun', 'dance', 'party', 'groovy', 'bouncy', 'lively', 'playful', 'optimistic', 'joyful', 'silly', 'excited', 'ecstatic', 'euphoric', 'blissful', 'carefree', 'free', 'inspired', 'hopeful', 'dreamy', 'contemplative', 'smooth', 'soft', 'creative', 'light', 'energetic');
                break;
            case 'clouds' || 'broken clouds':
                moods.push('moody', 'dreamy', 'contemplative', 'hopeful', 'smooth', 'soft', 'creative', 'light', 'reflective', 'introspective', 'soothing', 'calm', 'mellow', 'chill', 'relaxed', 'calming', 'restful', 'mystical', 'ambient', 'ethereal', 'winter', 'snowboarding', 'chill', 'mysterious', 'dense', 'hazy', 'blurry', 'slow', 'distant', 'dark', 'introspective');
                break;
            case 'drizzle':
                moods.push('mellow', 'calm', 'soft');
                break;
            case 'fog':
                moods.push('mysterious', 'dense', 'hazy');
                break;
            case 'haze':
                moods.push('blurry', 'slow', 'distant');
                break;
            case 'mist':
                moods.push('mystical', 'ambient', 'ethereal');
                break;
            case 'rain':
                moods.push('reflective', 'introspective', 'soothing');
                break;
            case 'snow':
                moods.push('winter', 'snowboarding', 'chill');
                break;
            case 'squall':
                moods.push('wild', 'turbulent', 'chaotic');
                break;
            case 'thunderstorm':
                moods.push('storm', 'epic', 'intense');
                break;
            case 'tornado':
                moods.push('powerful', 'fierce', 'destructive');
                break;
        }
    }
  // Determine time of day
  const hours = new Date().getHours();
  if (hours >= 6 && hours <= 18) {
    moods.push('creative', 'happy', 'light', 'energetic');
  } else {
    moods.push('relaxed', 'chill', 'calming', 'restful');
  }

  // Adjusting for the moon phase based on the sunCalcData
  switch (data.sunCalcData?.moonPhase) { 
    case 'full':
      moods.push('mysterious', 'magical');
      break;
    case 'new':
      moods.push('dark', 'introspective');
      break;
  }

  return {
    moods,
    genres: userGenres
  };
};

export const buildPlaylistQuery = (moodData: { moods: string[], genres: string[] }): string => {
  console.log('MOODS', moodData.moods);
  console.log('GENRES', moodData.genres);
  
  const moodQuery = moodData.moods.join(' ');
  const genreQuery = moodData.genres.join(',');

  // Forming the final query string
  let queryString = `q=${moodQuery}`;
  if (genreQuery) {
    queryString += `&genre=${genreQuery}`;
  }

  return queryString;
};

