import { AppState } from "../store/state";

interface MusicalMood {
  moods: string[];
  genres: string[] | null;
}

function shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  export const getMusicalMood = (data: AppState): MusicalMood => {
    let moods: string[] = [];
    const userGenres = localStorage.getItem('userGenres');
    const mainWeather = data?.weather?.weather?.[0]?.description.toLowerCase();
  
    // Mood tags based on weather
    if (data.weather && mainWeather) {
      switch (mainWeather) {
        case 'clear':
          moods.push('bright', 'sunny');
          break;
        case 'clouds':
        case 'broken clouds':
        case 'overcast clouds':
          moods.push('moody', 'overcast');
          break;
        case 'drizzle':
        case 'rain':
        case 'heavy intensity rain':
          moods.push('reflective', 'gloomy');
          break;
        case 'fog':
        case 'haze':
          moods.push('mysterious', 'foggy');
          break;
        case 'mist':
          moods.push('mystical', 'misty');
          break;
        case 'snow':
          moods.push('winter', 'chilly');
          break;
        case 'squall':
        case 'thunderstorm':
        case 'tornado':
          moods.push('intense', 'stormy');
          break;
      }
    }
  
    // Determine time of day
    const hours = new Date().getHours();
    // Adding an additional mood to each time of day for variety
    if (hours >= 4 && hours < 6) {
      moods.push('refreshing', 'awakening');
    } else if (hours >= 6 && hours < 8) {
      moods.push('light', 'morning');
    } else if (hours >= 8 && hours < 11) {
      moods.push('energetic', 'active');
    } else if (hours >= 11 && hours < 13) {
      moods.push('upbeat', 'hungry');
    } else if (hours >= 13 && hours < 14) {
      moods.push('lively', 'afternoon');
    } else if (hours >= 14 && hours < 16) {
      moods.push('steady', 'consistent');
    } else if (hours >= 16 && hours < 17) {
      moods.push('focused', 'determined');
    } else if (hours >= 17 && hours < 19) {
      moods.push('reflective', 'contemplative');
    } else {
      moods.push('relaxed', 'calm');
    }
  
    // Moon Phase (Added a secondary mood for each phase)
    const moonPhaseValue = data.sunCalcData?.moonPhase;
    if (typeof moonPhaseValue !== "undefined") {
      if (moonPhaseValue === 0) {
        moods.push('dark', 'moonless');
      } else if (moonPhaseValue < 0.25) {
        moods.push('hopeful', 'waxing');
      } else if (moonPhaseValue < 0.5) {
        moods.push('energized', 'half-moon');
      } else if (moonPhaseValue < 0.75) {
        moods.push('reflective', 'waning');
      } else {
        moods.push('rest', 'full-moon');
      }
    }
  
    moods = Array.from(new Set(moods)); // Remove duplicates
  
    // Ensure we always send out 7 moods
    const generalMoods = ['upbeat', 'mellow', 'energetic', 'reflective', 'creative', 'focused', 'introspective', 'soft'];
    while (moods.length < 7) {
      const additionalMood = shuffleArray(generalMoods).pop();
      if (!moods.includes(additionalMood)) {
        moods.push(additionalMood);
      }
    }
  
    return {
      moods,
      genres: userGenres ? JSON.parse(userGenres) : null
    };
  };
  

export const buildPlaylistQuery = (moodData: { moods: string[], genres: string[] }): string => {
    const moodQuery = moodData.moods.join(' ');
    const genreQuery = moodData.genres.join(',');
  
    // Forming the final query string
    let queryString = `q=${moodQuery}`;
    if (genreQuery) {
      queryString += `&genre=${genreQuery}`;
    }
  
    return queryString;
  };