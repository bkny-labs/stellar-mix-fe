import { AppState, initialState } from './state';
import { AppAction } from './actions';

export const appReducer = (state: AppState = initialState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_WEATHER':
      return 'payload' in action ? { ...state, weather: action.payload } : state;

    case 'SET_SUNCALC':
      return 'payload' in action ? { ...state, sunCalcData: action.payload } : state;

    case 'SET_SPOTIFY_PLAYLISTS':
      return 'payload' in action ? { ...state, spotifyPlaylists: action.payload } : state;

    case 'SET_SPOTIFY_ACCESS_TOKEN':
      return 'payload' in action ? { ...state, spotifyToken: action.payload } : state;

    case 'SET_USER_GENRES':
      return 'payload' in action 
        ? { 
          ...state, 
          userSettings: {
            ...state.userSettings,
            genres: action.payload 
          }
        } 
        : state;

  case 'SET_LOGGED_IN':
    if ("isLoggedIn" in action) {
      return { 
        ...state, 
        isLoggedIn: action.isLoggedIn, 
        spotifyToken: action.token !== undefined ? action.token : state.spotifyToken 
      };
    }
    return state;
    
    default:
      return state;
  }
};
