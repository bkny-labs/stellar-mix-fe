import { AppState } from "../model/state";

interface MusicalMood {
  moods: string[];
  genres: string[] | null;
}

export const getMusicalMood = (data: AppState): MusicalMood => {
  let moods: string[] = [];
  const userGenres = localStorage.getItem('userGenres');
  const mainWeather = data?.weather?.weather?.[0]?.description.toLowerCase();

  console.log('SUNCALC DATA:', data.sunCalcData);
  // Mood tags based on weather
  if (data.weather && mainWeather) {
      switch (mainWeather) {
          case 'clear':
          case 'scattered clouds':
              moods.push('upbeat', 'energetic', 'bright');
              break;
          case 'clouds':
          case 'broken clouds':
              moods.push('moody', 'dreamy', 'contemplative');
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
          case 'heavy intensity rain':
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
  if (hours >= 4 && hours < 7) {
      // Early Morning
      moods.push('refreshing', 'serene', 'tranquil', 'peaceful');
  } else if (hours >= 7 && hours < 11) {
      // Morning
      moods.push('creative', 'happy', 'light', 'energetic');
  } else if (hours >= 11 && hours < 14) {
      // Lunch Time
      moods.push('upbeat', 'bouncy', 'carefree', 'lively');
  } else if (hours >= 14 && hours < 17) {
      // Afternoon
      moods.push('focused', 'productive', 'steady', 'inspirational');
  } else if (hours >= 17 && hours < 20) {
      // Dusk
      moods.push('reflective', 'melancholic', 'gentle', 'soft');
  } else {
      // Evening/Night
      moods.push('relaxed', 'chill', 'calming', 'restful');
  }

  // Adding moon phase to the moods based on the sunCalcData
  const moonPhaseValue = data.sunCalcData?.moonPhase; 

  switch (true) {
      case (moonPhaseValue === 0):
          moods.push('dark', 'introspective', 'renewal');
          break;

      case (moonPhaseValue > 0 && moonPhaseValue < 0.25):
          moods.push('hopeful', 'growth', 'curious');
          break;

      case (moonPhaseValue === 0.25):
          moods.push('mysterious', 'magical', 'energized');
          break;

      case (moonPhaseValue > 0.25 && moonPhaseValue < 0.5):
          moods.push('anticipation', 'fulfilling', 'focused');
          break;

      case (moonPhaseValue === 0.5):
          moods.push('bright', 'revealing', 'emotional');
          break;

      case (moonPhaseValue > 0.5 && moonPhaseValue < 0.75):
          moods.push('reflective', 'gratitude', 'calm');
          break;

      case (moonPhaseValue === 0.75):
          moods.push('releasing', 'forgiveness', 'letting go');
          break;

      case (moonPhaseValue > 0.75 && moonPhaseValue < 1):
          moods.push('rest', 'preparation', 'dreamy');
          break;

      default:
          console.warn("Invalid moon phase value:", moonPhaseValue);
          break;
  }

  return {
    moods,
    genres: userGenres ? JSON.parse(userGenres) : null
  };
};

export const buildPlaylistQuery = (moodData: { moods: string[], genres: string[] }): string => {
  console.log('MOODS', moodData.moods);

  const moodQuery = moodData.moods.join(' ');
  const genreQuery = moodData.genres.join(',');

  // Forming the final query string
  let queryString = `q=${moodQuery}`;
  if (genreQuery) {
    queryString += `&genre=${genreQuery}`;
  }

  return queryString;
};

