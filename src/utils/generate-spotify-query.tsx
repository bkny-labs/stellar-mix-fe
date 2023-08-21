import { AppState } from "../model/state";

export const getMusicalMood = (data: AppState): string[] => {
  let moods: string[] = [];
  const userGenres = data.userSettings.genres;
  const mainWeather = data?.weather?.weather?.[0]?.main.toLowerCase();
    // Mood tags based on weather
    if (data.weather && mainWeather) {
        switch (mainWeather) {
            case 'clear':
                moods.push('upbeat', 'energetic', 'bright');
                break;
            case 'clouds' || 'broken clouds':
                moods.push('moody', 'dreamy', 'contemplative', 'hopeful');
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

  return moods;
};

export const buildPlaylistQuery = (moods: string[]): string => {
    console.log('MOODS', moods);
    // TODO dispatch current moods to store probably
  return moods.join(' ');
};
