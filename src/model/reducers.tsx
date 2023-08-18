import { AppState, initialState } from './state';
import { AppAction } from './actions';

export const appReducer = (state: AppState = initialState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_WEATHER':
      if ('payload' in action) {
        return { ...state, weather: action.payload };
      }
      return state;
    case 'SET_SUNCALC':
      if ('payload' in action) {
        return { ...state, sunCalcData: action.payload };
      }
      return state;
    case 'SET_SPOTIFY_PLAYLISTS':
      if ('payload' in action) {
        return { ...state, spotifyPlaylists: action.payload };
      }
      return state;
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.isLoggedIn, spotifyToken: action.token };
    default:
      return state;
  }
};

